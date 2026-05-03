package com.kenato.mixicook.dto;

import lombok.Data;
import java.util.List;

@Data
public class IngredientSearchRequest {
    private List<Long> ingredientIds;
}
