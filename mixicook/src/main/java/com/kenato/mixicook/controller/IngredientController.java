package com.kenato.mixicook.controller;

import com.kenato.mixicook.dto.*;
import com.kenato.mixicook.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ingredients")
public class IngredientController {

    @Autowired
    private IngredientService ingredientService;

    @GetMapping
    public ResponseEntity<PagedResponse<IngredientResponse>> getAllIngredients(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ingredientService.getAllIngredients(category, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredientResponse> getIngredientById(@PathVariable Long id) {
        return ResponseEntity.ok(ingredientService.getIngredientById(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<java.util.List<String>> getIngredientCategories() {
        return ResponseEntity.ok(ingredientService.getIngredientCategories());
    }
}
