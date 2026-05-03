package com.kenato.mixicook.service;

import com.kenato.mixicook.dto.*;
import org.springframework.data.domain.Pageable;

public interface RecipeService {
    PagedResponse<RecipeResponse> getAllRecipes(String title, Pageable pageable);
    RecipeResponse createRecipe(RecipeRequest recipeRequest);
    RecipeResponse getRecipeById(Long id);
    RecipeResponse updateRecipe(Long id, RecipeRequest recipeRequest);
    void deleteRecipe(Long id);
    PagedResponse<RecipeResponse> getMyRecipes(Pageable pageable);
    PagedResponse<RecipeResponse> getSavedRecipes(Pageable pageable);
    void toggleSaveRecipe(Long id);
    PagedResponse<RecipeResponse> searchByIngredients(IngredientSearchRequest searchRequest, Pageable pageable);
    
    // Review related
    PagedResponse<ReviewResponse> getRecipeReviews(Long recipeId, Pageable pageable);
    ReviewResponse addReview(Long recipeId, ReviewRequest reviewRequest);
    void deleteReview(Long reviewId);
}
