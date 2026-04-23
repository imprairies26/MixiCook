# MixiCook - Recipe Suggestion & Cooking Assistant

MixiCook is a mobile application designed to suggest recipes based on available ingredients, providing a seamless cooking experience with advanced features like hands-free cooking mode and personalized recommendations.

## Project Overview

- **Mobile App:** Built with React Native (Expo).
- **Planned Backend:** 
  - **Main Service:** Java 17, Spring Boot 3.5.13.
  - **ML Search Service:** Python (FastAPI/Flask) for ingredient-based recipe prediction.
  - **Database:** PostgreSQL.
- **Architecture:** Orchestrated Microservices (Hybrid approach for ML).

## Core Features

1.  **AI-Powered Search:** Suggests recipes based on available ingredients using a machine learning model.
2.  **Cooking Mode:** Hands-free UI with step-by-step instructions and integrated timers.
3.  **Community Hub:** Users can post their own recipes (mapped to system ingredients), rate, and comment on recipes.
4.  **Smart Shopping List:** Automatically generates a checklist of missing ingredients for chosen recipes.
5.  **Personalized Feed:** Recommendation engine based on user preferences and dietary restrictions.

## Tech Stack (Current & Planned)

### Frontend (Mobile)
- **Framework:** React Native / Expo
- **State Management:** Zustand
- **Navigation:** React Navigation (Native Stack, Bottom Tabs, Drawer)
- **Networking:** Axios
- **Styling:** Vanilla React Native Styles

### Backend (Planned)
- **Language:** Java 17
- **Framework:** Spring Boot 3.5.13
- **Database:** PostgreSQL
- **AI/ML:** Python (FastAPI/Flask)
- **Authentication:** JWT (JSON Web Token)

## Building and Running

### Frontend (Mobile)
Commands are run from the `product` directory:
- `npm install`: Install dependencies.
- `npx expo start`: Start the Expo development server.
- `npm run android`: Start for Android.
- `npm run ios`: Start for iOS.
- `npm run web`: Start for Web.

### Backend
The backend project is currently in the design phase. A `report.md` file contains the detailed design and recommended dependencies for Spring Initializr.

## Development Conventions

- **Frontend Structure:**
  - `src/components/common`: Reusable UI components (Button, Header, Input, etc.).
  - `src/screens`: Individual app screens.
  - `src/store`: Zustand store for state management.
  - `src/navigation`: Navigation configuration.
  - `src/constants`: App-wide constants like Theme.
- **Backend Design:**
  - Follows a hybrid microservice architecture where Python acts as a stateless engine.
  - Ingredients are picked from a predefined system list to ensure data consistency for the ML model.

## Documentation
- `report.md`: Detailed backend and database design report.
- `product/app-idea.txt`: Original feature set and business logic requirements.
