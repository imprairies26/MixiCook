package com.kenato.mixicook.repository;

import com.kenato.mixicook.entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, RecipeIngredient.RecipeIngredientId> {
}
