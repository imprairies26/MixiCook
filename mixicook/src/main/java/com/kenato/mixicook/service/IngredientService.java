package com.kenato.mixicook.service;

import com.kenato.mixicook.dto.*;
import org.springframework.data.domain.Pageable;

public interface IngredientService {
    PagedResponse<IngredientResponse> getAllIngredients(String category, Pageable pageable);
    IngredientResponse getIngredientById(Long id);
    java.util.List<String> getIngredientCategories();
}
