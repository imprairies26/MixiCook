# Frontend Functions Requiring Backend API

This document lists the functionalities in the MixiCook mobile application that interact with the backend API.

## 1. Authentication & User Management
- **Register:** Create a new user account (`POST /api/v1/auth/register`).
- **Login:** Authenticate user and receive a JWT token (`POST /api/v1/auth/login`).
- **Get Current User:** Retrieve profile information for the authenticated user (`GET /api/v1/auth/me`).
- **Update Profile:** Modify user details like name, email or avatar (`PUT /api/v1/auth/profile`).
- **Forgot Password:** Request an OTP for password recovery (`POST /api/v1/auth/forgot-password`).
- **Reset Password:** Verify OTP and set a new password (`POST /api/v1/auth/reset-password`).

## 2. Recipe Management
- **Get Home Feed:** Fetch categorized recipe lists (Trending, Top Rated, AI Suggestions) (`GET /api/v1/recipes`).
- **Search Recipes by Name:** Find recipes matching a keyword string (`GET /api/v1/recipes?title=...`).
- **AI Search by Ingredients:** Find recipes based on a selected list of ingredient IDs using the ML model (`POST /api/v1/recipes/search-by-ingredients`).
- **Get Recipe Detail:** Retrieve full information for a specific recipe (`GET /api/v1/recipes/{id}`).
- **Post Recipe:** Allow users to share their own recipes (`POST /api/v1/recipes`).
- **Update/Delete Recipe:** Manage user-owned recipes (`PUT/DELETE /api/v1/recipes/{id}`).
- **Get My Recipes:** Fetch recipes created by the current user (`GET /api/v1/recipes/my`).

## 3. Ingredient System
- **Get Ingredient List:** Fetch master list of ingredients (`GET /api/v1/ingredients`).
- **Get Ingredient Categories:** Fetch unique categories for filtering (`GET /api/v1/ingredients/categories`).
- **Get Ingredient Detail:** Fetch specific ingredient data (`GET /api/v1/ingredients/{id}`).

## 4. Social & Interaction
- **Save/Favorite Recipe:** Toggle saving a recipe (`POST /api/v1/recipes/{id}/save`).
- **Get Saved Recipes:** Retrieve favorited recipes (`GET /api/v1/recipes/saved`).
- **Manage Reviews:**
  - Get reviews for a recipe (`GET /api/v1/recipes/{id}/reviews`).
  - Post a new review and rating (`POST /api/v1/recipes/{id}/reviews`).
  - Delete a personal review (`DELETE /api/v1/reviews/{reviewId}`).

## 5. User Personal State (Cloud Sync)
- **Fridge (Tủ lạnh):**
  - Get current cloud-stored ingredients (`GET /api/v1/me/fridge`).
  - Sync local fridge state to cloud (`PUT /api/v1/me/fridge`).
- **Shopping List (Giỏ đi chợ):**
  - Get stored shopping items (`GET /api/v1/me/shopping-list`).
  - Add item to list (`POST /api/v1/me/shopping-list`).
  - Update item status (check/uncheck) or amount (`PATCH /api/v1/me/shopping-list/{itemId}`).
  - Remove an item (`DELETE /api/v1/me/shopping-list/{itemId}`).
  - Clear entire shopping list (`DELETE /api/v1/me/shopping-list`).
