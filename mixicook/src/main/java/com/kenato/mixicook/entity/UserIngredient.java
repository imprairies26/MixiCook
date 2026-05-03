package com.kenato.mixicook.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(UserIngredientId.class)
public class UserIngredient {
    @Id
    @Column(name = "user_id")
    private java.util.UUID userId;

    @Id
    @Column(name = "ingredient_id")
    private Long ingredientId;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class UserIngredientId implements Serializable {
    private java.util.UUID userId;
    private Long ingredientId;
}
