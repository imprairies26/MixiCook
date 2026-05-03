package com.kenato.mixicook.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kenato.mixicook.dto.*;
import com.kenato.mixicook.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private RecipeService recipeService;

    @MockBean
    private IngredientService ingredientService;

    @MockBean
    private UserService userService;

    // --- Auth Tests ---
    @Test
    public void login_ShouldReturn200() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        request.setPassword("password");

        when(authService.login(any())).thenReturn(AuthResponse.builder().build());

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    public void register_ShouldReturn200() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("new@example.com");
        request.setPassword("password");

        when(authService.register(any())).thenReturn(AuthResponse.builder().build());

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    // --- Ingredient Tests ---
    @Test
    @WithMockUser
    public void getAllIngredients_ShouldReturn200() throws Exception {
        when(ingredientService.getAllIngredients(any(), any())).thenReturn(PagedResponse.<IngredientResponse>builder().build());

        mockMvc.perform(get("/api/v1/ingredients"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void getIngredientCategories_ShouldReturn200() throws Exception {
        when(ingredientService.getIngredientCategories()).thenReturn(List.of("Rau củ"));

        mockMvc.perform(get("/api/v1/ingredients/categories"))
                .andExpect(status().isOk());
    }

    // --- Recipe Tests ---
    @Test
    @WithMockUser
    public void getAllRecipes_ShouldReturn200() throws Exception {
        when(recipeService.getAllRecipes(any(), any())).thenReturn(PagedResponse.<RecipeResponse>builder().build());

        mockMvc.perform(get("/api/v1/recipes"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void getRecipeById_ShouldReturn200() throws Exception {
        when(recipeService.getRecipeById(1L)).thenReturn(RecipeResponse.builder().build());

        mockMvc.perform(get("/api/v1/recipes/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void searchByIngredients_ShouldReturn200() throws Exception {
        IngredientSearchRequest request = new IngredientSearchRequest();
        request.setIngredientIds(List.of(1L, 2L));

        when(recipeService.searchByIngredients(any(), any())).thenReturn(PagedResponse.<RecipeResponse>builder().build());

        mockMvc.perform(post("/api/v1/recipes/search-by-ingredients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    // --- User State Tests ---
    @Test
    @WithMockUser
    public void getUserFridge_ShouldReturn200() throws Exception {
        when(userService.getUserFridge()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/me/fridge"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void getShoppingList_ShouldReturn200() throws Exception {
        when(userService.getShoppingList()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/me/shopping-list"))
                .andExpect(status().isOk());
    }
}
