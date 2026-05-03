package com.kenato.mixicook.repository;

import com.kenato.mixicook.entity.Recipe;
import com.kenato.mixicook.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Page<Recipe> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Recipe> findByUser(User user, Pageable pageable);
    
    @Query("SELECT r FROM Recipe r WHERE r.isSystem = true")
    Page<Recipe> findSystemRecipes(Pageable pageable);

    @Query("SELECT r FROM Recipe r WHERE r.id IN :ids")
    List<Recipe> findAllByIdIn(List<Long> ids);
}
