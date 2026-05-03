package com.kenato.mixicook.repository;

import com.kenato.mixicook.entity.Ingredient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    Page<Ingredient> findByCategory(String category, Pageable pageable);
    
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT i.category FROM Ingredient i WHERE i.category IS NOT NULL")
    java.util.List<String> findDistinctCategories();
}
