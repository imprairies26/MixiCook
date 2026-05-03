package com.kenato.mixicook.service;

import java.util.List;

public interface MLSearchService {
    List<Long> predict(List<Long> ingredientIds);
}
