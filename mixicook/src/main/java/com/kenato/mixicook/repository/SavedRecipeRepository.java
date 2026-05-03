package com.kenato.mixicook.repository;

import com.kenato.mixicook.entity.Recipe;
import com.kenato.mixicook.entity.SavedRecipe;
import com.kenato.mixicook.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedRecipeRepository extends JpaRepository<SavedRecipe, Long> {
    Optional<SavedRecipe> findByUserAndRecipe(User user, Recipe recipe);
    Page<SavedRecipe> findByUser(User user, Pageable pageable);
    Boolean existsByUserAndRecipe(User user, Recipe recipe);
}
