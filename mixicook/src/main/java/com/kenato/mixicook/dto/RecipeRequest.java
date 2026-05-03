package com.kenato.mixicook.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class RecipeRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    private String description;

    @NotNull
    private List<String> instructions;

    private String imageUrl;

    private Integer cookingTime;

    private String difficulty;

    @NotEmpty
    private List<RecipeIngredientRequest> ingredients;

    @Data
    public static class RecipeIngredientRequest {
        @NotNull
        private Long ingredientId;
        @NotNull
        private Float amount;
        private String unit;
    }
}
