package com.kenato.mixicook.controller;

import com.kenato.mixicook.dto.*;
import com.kenato.mixicook.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/me")
public class UserController {

    @Autowired
    private UserService userService;

    // Fridge Endpoints
    @GetMapping("/fridge")
    public ResponseEntity<List<IngredientResponse>> getUserFridge() {
        return ResponseEntity.ok(userService.getUserFridge());
    }

    @PutMapping("/fridge")
    public ResponseEntity<Void> syncFridge(@RequestBody List<Long> ingredientIds) {
        userService.syncFridge(ingredientIds);
        return ResponseEntity.ok().build();
    }

    // Shopping List Endpoints
    @GetMapping("/shopping-list")
    public ResponseEntity<List<ShoppingItemResponse>> getShoppingList() {
        return ResponseEntity.ok(userService.getShoppingList());
    }

    @PostMapping("/shopping-list")
    public ResponseEntity<ShoppingItemResponse> addShoppingItem(@Valid @RequestBody ShoppingItemRequest request) {
        return ResponseEntity.ok(userService.addShoppingItem(request));
    }

    @PatchMapping("/shopping-list/{itemId}")
    public ResponseEntity<ShoppingItemResponse> updateShoppingItem(
            @PathVariable Long itemId,
            @RequestBody ShoppingItemRequest request) {
        return ResponseEntity.ok(userService.updateShoppingItem(itemId, request));
    }

    @DeleteMapping("/shopping-list/{itemId}")
    public ResponseEntity<Void> deleteShoppingItem(@PathVariable Long itemId) {
        userService.deleteShoppingItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/shopping-list")
    public ResponseEntity<Void> clearShoppingList() {
        userService.clearShoppingList();
        return ResponseEntity.noContent().build();
    }
}
