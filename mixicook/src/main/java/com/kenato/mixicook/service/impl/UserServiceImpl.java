package com.kenato.mixicook.service.impl;

import com.kenato.mixicook.dto.*;
import com.kenato.mixicook.entity.*;
import com.kenato.mixicook.exception.CustomException;
import com.kenato.mixicook.repository.*;
import com.kenato.mixicook.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private UserIngredientRepository userIngredientRepository;

    @Autowired
    private ShoppingItemRepository shoppingItemRepository;

    @Override
    public List<IngredientResponse> getUserFridge() {
        User user = getCurrentUserEntity();
        List<UserIngredient> userIngredients = userIngredientRepository.findByUserId(user.getId());
        List<Long> ids = userIngredients.stream().map(UserIngredient::getIngredientId).collect(Collectors.toList());
        
        return ingredientRepository.findAllById(ids).stream()
                .map(this::mapToIngredientResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void syncFridge(List<Long> ingredientIds) {
        User user = getCurrentUserEntity();
        userIngredientRepository.deleteByUserId(user.getId());
        
        List<UserIngredient> newIngredients = ingredientIds.stream()
                .map(id -> UserIngredient.builder()
                        .userId(user.getId())
                        .ingredientId(id)
                        .build())
                .collect(Collectors.toList());
        
        userIngredientRepository.saveAll(newIngredients);
    }

    @Override
    public List<ShoppingItemResponse> getShoppingList() {
        User user = getCurrentUserEntity();
        return shoppingItemRepository.findByUserId(user.getId()).stream()
                .map(this::mapToShoppingItemResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ShoppingItemResponse addShoppingItem(ShoppingItemRequest request) {
        User user = getCurrentUserEntity();
        ShoppingItem item = ShoppingItem.builder()
                .userId(user.getId())
                .name(request.getName())
                .amount(request.getAmount())
                .unit(request.getUnit())
                .isChecked(request.getIsChecked() != null ? request.getIsChecked() : false)
                .build();
        
        return mapToShoppingItemResponse(shoppingItemRepository.save(item));
    }

    @Override
    @Transactional
    public ShoppingItemResponse updateShoppingItem(Long itemId, ShoppingItemRequest request) {
        ShoppingItem item = shoppingItemRepository.findById(itemId)
                .orElseThrow(() -> new CustomException("Item not found", HttpStatus.NOT_FOUND));
        
        User user = getCurrentUserEntity();
        if (!item.getUserId().equals(user.getId())) {
            throw new CustomException("Forbidden", HttpStatus.FORBIDDEN);
        }

        if (request.getName() != null) item.setName(request.getName());
        if (request.getAmount() != null) item.setAmount(request.getAmount());
        if (request.getUnit() != null) item.setUnit(request.getUnit());
        if (request.getIsChecked() != null) item.setIsChecked(request.getIsChecked());

        return mapToShoppingItemResponse(shoppingItemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteShoppingItem(Long itemId) {
        ShoppingItem item = shoppingItemRepository.findById(itemId)
                .orElseThrow(() -> new CustomException("Item not found", HttpStatus.NOT_FOUND));
        
        User user = getCurrentUserEntity();
        if (!item.getUserId().equals(user.getId())) {
            throw new CustomException("Forbidden", HttpStatus.FORBIDDEN);
        }

        shoppingItemRepository.delete(item);
    }

    @Override
    @Transactional
    public void clearShoppingList() {
        User user = getCurrentUserEntity();
        shoppingItemRepository.deleteByUserId(user.getId());
    }

    private User getCurrentUserEntity() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
    }

    private IngredientResponse mapToIngredientResponse(Ingredient ingredient) {
        return IngredientResponse.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .category(ingredient.getCategory())
                .imageUrl(ingredient.getImageUrl())
                .build();
    }

    private ShoppingItemResponse mapToShoppingItemResponse(ShoppingItem item) {
        return ShoppingItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .amount(item.getAmount())
                .unit(item.getUnit())
                .isChecked(item.getIsChecked())
                .build();
    }
}
