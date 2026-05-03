package com.kenato.mixicook.controller;

import com.kenato.mixicook.dto.*;
import com.kenato.mixicook.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @GetMapping
    public ResponseEntity<PagedResponse<RecipeResponse>> getAllRecipes(
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.getAllRecipes(title, pageable));
    }

    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(@Valid @RequestBody RecipeRequest recipeRequest) {
        return ResponseEntity.ok(recipeService.createRecipe(recipeRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipeById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> updateRecipe(@PathVariable Long id, @Valid @RequestBody RecipeRequest recipeRequest) {
        return ResponseEntity.ok(recipeService.updateRecipe(id, recipeRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<PagedResponse<RecipeResponse>> getMyRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.getMyRecipes(pageable));
    }

    @GetMapping("/saved")
    public ResponseEntity<PagedResponse<RecipeResponse>> getSavedRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.getSavedRecipes(pageable));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<Void> toggleSaveRecipe(@PathVariable Long id) {
        recipeService.toggleSaveRecipe(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/search-by-ingredients")
    public ResponseEntity<PagedResponse<RecipeResponse>> searchByIngredients(
            @RequestBody IngredientSearchRequest searchRequest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recipeService.searchByIngredients(searchRequest, pageable));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<PagedResponse<ReviewResponse>> getRecipeReviews(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(recipeService.getRecipeReviews(id, PageRequest.of(page, size)));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.ok(recipeService.addReview(id, reviewRequest));
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        recipeService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
