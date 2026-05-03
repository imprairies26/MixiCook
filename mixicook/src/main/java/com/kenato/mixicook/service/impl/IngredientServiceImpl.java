package com.kenato.mixicook.service.impl;

import com.kenato.mixicook.dto.*;
import com.kenato.mixicook.entity.Ingredient;
import com.kenato.mixicook.exception.CustomException;
import com.kenato.mixicook.repository.IngredientRepository;
import com.kenato.mixicook.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IngredientServiceImpl implements IngredientService {

    @Autowired
    private IngredientRepository ingredientRepository;

    @Override
    public PagedResponse<IngredientResponse> getAllIngredients(String category, Pageable pageable) {
        Page<Ingredient> ingredients;
        if (category != null && !category.isEmpty()) {
            ingredients = ingredientRepository.findByCategory(category, pageable);
        } else {
            ingredients = ingredientRepository.findAll(pageable);
        }

        List<IngredientResponse> content = ingredients.getContent().stream()
                .map(this::mapToIngredientResponse)
                .collect(Collectors.toList());

        return PagedResponse.<IngredientResponse>builder()
                .content(content)
                .page(ingredients.getNumber())
                .size(ingredients.getSize())
                .totalElements(ingredients.getTotalElements())
                .totalPages(ingredients.getTotalPages())
                .build();
    }

    @Override
    public IngredientResponse getIngredientById(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new CustomException("Ingredient not found", HttpStatus.NOT_FOUND));
        return mapToIngredientResponse(ingredient);
    }

    @Override
    public java.util.List<String> getIngredientCategories() {
        return ingredientRepository.findDistinctCategories();
    }

    private IngredientResponse mapToIngredientResponse(Ingredient ingredient) {
        return IngredientResponse.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .category(ingredient.getCategory())
                .imageUrl(ingredient.getImageUrl())
                .build();
    }
}
