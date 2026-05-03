package com.kenato.mixicook.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingItemRequest {
    private String name;
    private Float amount;
    private String unit;
    private Boolean isChecked;
}
