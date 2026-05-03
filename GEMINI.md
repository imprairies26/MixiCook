# MixiCook - Project Context

MixiCook is a full-stack application designed to suggest cooking recipes based on available ingredients provided by the user.

## Project Overview

- **Backend:** Spring Boot 3.5 (Java 17) managed with Maven. It uses PostgreSQL for data persistence and implements a RESTful API with JWT-based security.
- **Frontend:** React Native (Expo 54) mobile application. It utilizes Zustand for lightweight state management and Axios for API communication.
- **Key Features:** User authentication, recipe CRUD, ingredient management ("Fridge"), and AI-assisted searching.

## Directory Structure

- `/mixicook`: Spring Boot backend source code.
- `/product`: React Native frontend source code.
- `mixicook.sql`: Database schema initialization script.
- `function.md`, `report.md`: Project documentation and requirement specifications.

## Building and Running

### Backend (`/mixicook`)
- **Requirements:** JDK 17, Maven.
- **Build:** `./mvnw clean install`
- **Run:** `./mvnw spring-boot:run`
- **Test:** `./mvnw test`

### Frontend (`/product`)
- **Requirements:** Node.js, npm/yarn, Expo CLI.
- **Install:** `npm install`
- **Start:** `npm start` (opens Expo Go QR code)
- **Platforms:** `npm run android`, `npm run ios`, or `npm run web`.

## Development Conventions

### Backend Patterns
- **Architecture:** Standard Layered Architecture (Controller -> Service -> Repository).
- **Contracts:** Always use DTOs (`dto/`) for API requests and responses to decouple the database schema from the API.
- **Persistence:** Use Spring Data JPA repositories. Note: `Recipe` entity uses `jsonb` for instructions, requiring PostgreSQL.
- **Security:** Security logic is centralized in `config/SecurityConfig.java` and `security/`. JWT filters intercept all `/api/v1/**` requests except for `auth`.

### Frontend Patterns
- **State:** Zustand stores live in `src/store/`. Keep stores focused (e.g., `useAuthStore`, `useRecipeStore`).
- **Navigation:** Managed via React Navigation in `src/navigation/AppNavigation.js`.
- **UI:** Consistent styling using `src/constants/Theme.js`. Prefer using components from `src/components/common/`.
- **Formatting:** Prettier is configured as a dependency.

### Git Guidelines
- Follow **Conventional Commits** for all changes.
- Ensure backend `./mvnw compile` and frontend `npm run start` (checks for syntax errors) pass before submitting changes.
