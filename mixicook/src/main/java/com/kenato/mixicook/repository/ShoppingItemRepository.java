package com.kenato.mixicook.repository;

import com.kenato.mixicook.entity.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {
    List<ShoppingItem> findByUserId(UUID userId);
    void deleteByUserId(UUID userId);
}
