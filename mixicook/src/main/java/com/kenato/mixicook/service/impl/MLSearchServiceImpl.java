package com.kenato.mixicook.service.impl;

import com.kenato.mixicook.service.MLSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
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
            // Log error and return empty list or fallback
            // For now, return empty list to avoid breaking the main flow
            System.err.println("Error calling ML service: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
