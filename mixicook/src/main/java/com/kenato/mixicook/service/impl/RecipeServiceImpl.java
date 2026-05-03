package com.kenato.mixicook.service.impl;

import com.kenato.mixicook.dto.*;
import com.kenato.mixicook.entity.*;
import com.kenato.mixicook.exception.CustomException;
import com.kenato.mixicook.repository.*;
import com.kenato.mixicook.service.RecipeService;
import com.kenato.mixicook.service.MLSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeServiceImpl implements RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private SavedRecipeRepository savedRecipeRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MLSearchService mlSearchService;

    @Override
    public PagedResponse<RecipeResponse> getAllRecipes(String title, Pageable pageable) {
        Page<Recipe> recipes;
        if (title != null && !title.isEmpty()) {
            recipes = recipeRepository.findByTitleContainingIgnoreCase(title, pageable);
        } else {
            recipes = recipeRepository.findAll(pageable);
        }
        return mapToPagedResponse(recipes);
    }

    @Override
    @Transactional
    public RecipeResponse createRecipe(RecipeRequest recipeRequest) {
        User user = getCurrentUserEntity();
        
        Recipe recipe = Recipe.builder()
                .title(recipeRequest.getTitle())
                .description(recipeRequest.getDescription())
                .instructions(recipeRequest.getInstructions())
                .imageUrl(recipeRequest.getImageUrl())
                .cookingTime(recipeRequest.getCookingTime())
                .difficulty(recipeRequest.getDifficulty())
                .user(user)
                .isSystem(false)
                .ingredients(new ArrayList<>())
                .build();

        recipe = recipeRepository.save(recipe);

        for (RecipeRequest.RecipeIngredientRequest ir : recipeRequest.getIngredients()) {
            Ingredient ingredient = ingredientRepository.findById(ir.getIngredientId())
                    .orElseThrow(() -> new CustomException("Ingredient not found: " + ir.getIngredientId(), HttpStatus.NOT_FOUND));
            
            RecipeIngredient ri = RecipeIngredient.builder()
                    .id(new RecipeIngredient.RecipeIngredientId(recipe.getId(), ingredient.getId()))
                    .recipe(recipe)
                    .ingredient(ingredient)
                    .amount(ir.getAmount())
                    .unit(ir.getUnit())
                    .build();
            recipe.getIngredients().add(ri);
        }

        return mapToRecipeResponse(recipeRepository.save(recipe));
    }

    @Override
    public RecipeResponse getRecipeById(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new CustomException("Recipe not found", HttpStatus.NOT_FOUND));
        return mapToRecipeResponse(recipe);
    }

    @Override
    @Transactional
    public RecipeResponse updateRecipe(Long id, RecipeRequest recipeRequest) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new CustomException("Recipe not found", HttpStatus.NOT_FOUND));
        
        User currentUser = getCurrentUserEntity();
        if (recipe.getUser() == null || !recipe.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("You are not the owner of this recipe", HttpStatus.FORBIDDEN);
        }

        recipe.setTitle(recipeRequest.getTitle());
        recipe.setDescription(recipeRequest.getDescription());
        recipe.setInstructions(recipeRequest.getInstructions());
        recipe.setImageUrl(recipeRequest.getImageUrl());
        recipe.setCookingTime(recipeRequest.getCookingTime());
        recipe.setDifficulty(recipeRequest.getDifficulty());

        recipe.getIngredients().clear();
        for (RecipeRequest.RecipeIngredientRequest ir : recipeRequest.getIngredients()) {
            Ingredient ingredient = ingredientRepository.findById(ir.getIngredientId())
                    .orElseThrow(() -> new CustomException("Ingredient not found", HttpStatus.NOT_FOUND));
            
            RecipeIngredient ri = RecipeIngredient.builder()
                    .id(new RecipeIngredient.RecipeIngredientId(recipe.getId(), ingredient.getId()))
                    .recipe(recipe)
                    .ingredient(ingredient)
                    .amount(ir.getAmount())
                    .unit(ir.getUnit())
                    .build();
            recipe.getIngredients().add(ri);
        }

        return mapToRecipeResponse(recipeRepository.save(recipe));
    }

    @Override
    @Transactional
    public void deleteRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new CustomException("Recipe not found", HttpStatus.NOT_FOUND));
        
        User currentUser = getCurrentUserEntity();
        if (recipe.getUser() == null || !recipe.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("You are not the owner of this recipe", HttpStatus.FORBIDDEN);
        }

        recipeRepository.delete(recipe);
    }

    @Override
    public PagedResponse<RecipeResponse> getMyRecipes(Pageable pageable) {
        User user = getCurrentUserEntity();
        Page<Recipe> recipes = recipeRepository.findByUser(user, pageable);
        return mapToPagedResponse(recipes);
    }

    @Override
    public PagedResponse<RecipeResponse> getSavedRecipes(Pageable pageable) {
        User user = getCurrentUserEntity();
        Page<SavedRecipe> saved = savedRecipeRepository.findByUser(user, pageable);
        
        List<RecipeResponse> content = saved.getContent().stream()
                .map(s -> mapToRecipeResponse(s.getRecipe()))
                .collect(Collectors.toList());

        return PagedResponse.<RecipeResponse>builder()
                .content(content)
                .page(saved.getNumber())
                .size(saved.getSize())
                .totalElements(saved.getTotalElements())
                .totalPages(saved.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public void toggleSaveRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new CustomException("Recipe not found", HttpStatus.NOT_FOUND));
        User user = getCurrentUserEntity();

        savedRecipeRepository.findByUserAndRecipe(user, recipe)
                .ifPresentOrElse(
                        savedRecipeRepository::delete,
                        () -> savedRecipeRepository.save(SavedRecipe.builder().user(user).recipe(recipe).build())
                );
    }

    @Override
    public PagedResponse<RecipeResponse> searchByIngredients(IngredientSearchRequest searchRequest, Pageable pageable) {
        List<Long> recipeIds = new ArrayList<>();
        try {
            recipeIds = mlSearchService.predict(searchRequest.getIngredientIds());
        } catch (Exception e) {
            // Log lỗi nhưng không chặn luồng chính, sẽ fallback về DB search
            System.err.println("ML Service error, falling back to DB search: " + e.getMessage());
        }

        Page<Recipe> recipePage;
        if (recipeIds != null && !recipeIds.isEmpty()) {
            // Ưu tiên kết quả từ ML nếu có
            List<Recipe> recipes = recipeRepository.findAllByIdIn(recipeIds);
            recipePage = new PageImpl<>(recipes, pageable, recipes.size());
        } else {
            // Fallback: Tìm kiếm trực tiếp trong DB theo nguyên liệu (Hard match)
            recipePage = recipeRepository.findByIngredients(searchRequest.getIngredientIds(), pageable);
        }
        
        return mapToPagedResponse(recipePage);
    }

    @Override
    public PagedResponse<ReviewResponse> getRecipeReviews(Long recipeId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByRecipeId(recipeId, pageable);
        List<ReviewResponse> content = reviews.getContent().stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ReviewResponse>builder()
                .content(content)
                .page(reviews.getNumber())
                .size(reviews.getSize())
                .totalElements(reviews.getTotalElements())
                .totalPages(reviews.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public ReviewResponse addReview(Long recipeId, ReviewRequest reviewRequest) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new CustomException("Recipe not found", HttpStatus.NOT_FOUND));
        
        User user = getCurrentUserEntity();

        Review review = Review.builder()
                .recipe(recipe)
                .user(user)
                .rating(reviewRequest.getRating())
                .comment(reviewRequest.getComment())
                .imageUrl(reviewRequest.getImageUrl())
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapToReviewResponse(savedReview);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException("Review not found", HttpStatus.NOT_FOUND));
        
        User user = getCurrentUserEntity();
        if (!review.getUser().getId().equals(user.getId())) {
            throw new CustomException("You do not have permission to delete this review", HttpStatus.FORBIDDEN);
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .username(review.getUser().getUsername())
                .userAvatar(review.getUser().getAvatarUrl())
                .rating(review.getRating())
                .comment(review.getComment())
                .imageUrl(review.getImageUrl())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
    }

    private RecipeResponse mapToRecipeResponse(Recipe recipe) {
        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .instructions(recipe.getInstructions())
                .imageUrl(recipe.getImageUrl())
                .cookingTime(recipe.getCookingTime())
                .difficulty(recipe.getDifficulty())
                .isSystem(recipe.getIsSystem())
                .createdAt(recipe.getCreatedAt())
                .author(recipe.getUser() != null ? mapToUserResponse(recipe.getUser()) : null)
                .ingredients(recipe.getIngredients().stream()
                        .map(ri -> RecipeResponse.RecipeIngredientResponse.builder()
                                .ingredientId(ri.getIngredient().getId())
                                .name(ri.getIngredient().getName())
                                .amount(ri.getAmount())
                                .unit(ri.getUnit())
                                .imageUrl(ri.getIngredient().getImageUrl())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private PagedResponse<RecipeResponse> mapToPagedResponse(Page<Recipe> recipes) {
        List<RecipeResponse> content = recipes.getContent().stream()
                .map(this::mapToRecipeResponse)
                .collect(Collectors.toList());

        return PagedResponse.<RecipeResponse>builder()
                .content(content)
                .page(recipes.getNumber())
                .size(recipes.getSize())
                .totalElements(recipes.getTotalElements())
                .totalPages(recipes.getTotalPages())
                .build();
    }
}
