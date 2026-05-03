package com.kenato.mixicook.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeResponse {
    private Long id;
    private String title;
    private String description;
    private List<String> instructions;
    private String imageUrl;
    private Integer cookingTime;
    private String difficulty;
    private Boolean isSystem;
    private LocalDateTime createdAt;
    private List<RecipeIngredientResponse> ingredients;
    private UserResponse author;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecipeIngredientResponse {
        private Long ingredientId;
        private String name;
        private Float amount;
        private String unit;
        private String imageUrl;
    }
}
