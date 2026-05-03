package com.kenato.mixicook.repository;

import com.kenato.mixicook.entity.UserIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserIngredientRepository extends JpaRepository<UserIngredient, Object> {
    List<UserIngredient> findByUserId(UUID userId);
    void deleteByUserId(UUID userId);
}
