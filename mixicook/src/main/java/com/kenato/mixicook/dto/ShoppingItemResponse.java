package com.kenato.mixicook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingItemResponse {
    private Long id;
    private String name;
    private Float amount;
    private String unit;
    private Boolean isChecked;
}
