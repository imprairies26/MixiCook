package com.kenato.mixicook.service;

import com.kenato.mixicook.dto.*;
import java.util.List;

public interface UserService {
    // Fridge (User Ingredients)
    List<IngredientResponse> getUserFridge();
    void syncFridge(List<Long> ingredientIds);

    // Shopping List
    List<ShoppingItemResponse> getShoppingList();
    ShoppingItemResponse addShoppingItem(ShoppingItemRequest request);
    ShoppingItemResponse updateShoppingItem(Long itemId, ShoppingItemRequest request);
    void deleteShoppingItem(Long itemId);
    void clearShoppingList();
}
