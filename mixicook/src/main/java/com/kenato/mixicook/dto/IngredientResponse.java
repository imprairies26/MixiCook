package com.kenato.mixicook.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientResponse {
    private Long id;
    private String name;
    private String category;
    private String imageUrl;
}
