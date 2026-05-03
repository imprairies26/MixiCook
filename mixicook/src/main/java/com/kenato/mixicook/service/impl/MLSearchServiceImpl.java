package com.kenato.mixicook.service.impl;

import com.kenato.mixicook.exception.CustomException;
import com.kenato.mixicook.service.MLSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MLSearchServiceImpl implements MLSearchService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${app.ml-service.url}")
    private String mlServiceUrl;

    @Override
    public List<Long> predict(List<Long> ingredientIds) {
        try {
            // Request body format: {"ingredient_ids": [1, 2, 3]}
            Map<String, Object> request = Map.of("ingredient_ids", ingredientIds);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request);

            ResponseEntity<List<Long>> response = restTemplate.exchange(
                    mlServiceUrl,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<List<Long>>() {}
            );

            return response.getBody() != null ? response.getBody() : new ArrayList<>();
        } catch (Exception e) {
            // Ném ngoại lệ để GlobalExceptionHandler xử lý, không trả về list rỗng giả tạo
            throw new CustomException("Dịch vụ gợi ý món ăn (ML) hiện không khả dụng: " + e.getMessage(), 
                    HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
