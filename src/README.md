# React Base Framework Structure

This project is organized to serve as a scalable, maintainable base for small to large React applications. The folder structure is designed for clarity, modularity, and ease of configuration.

## Folder Structure Overview

```
src/
  components/         # Reusable UI components (buttons, forms, etc.)
  features/           # Feature modules (auth, dashboard, profile, etc.)
  hooks/              # Custom React hooks
  utils/              # Utility functions/helpers
  services/           # API calls, external services
  config/             # App configuration (env, routes, theme, etc.)
  assets/             # Static assets (images, fonts, etc.)
  layouts/            # Layout components (wrappers, templates)
  contexts/           # React context providers
  routes/             # Route definitions and guards
  styles/             # Global and shared styles
  App.js
  index.js
```

## Folder Explanations

- **components/**: Contains shared, reusable UI components (e.g., Button, Modal, Input). These are generic and not tied to a specific feature.

- **features/**: Each subfolder represents a feature or domain (e.g., `auth`, `dashboard`). Feature folders can contain their own components, hooks, services, and state management logic, making it easy to scale and maintain.

- **hooks/**: Custom React hooks that are used across multiple features or components.

- **utils/**: Utility functions and helpers that are not React-specific but are used throughout the app.

- **services/**: Abstractions for API calls and external services. Centralizes data fetching and integration logic.

- **config/**: Application configuration files, such as environment variables, theme settings, route configs, and feature toggles. This makes the app easily configurable and adaptable.

- **assets/**: Static files like images, fonts, and icons. Keeps the project organized and assets easy to find.

- **layouts/**: Layout components that define the structure of pages (e.g., MainLayout, AuthLayout). Useful for consistent page templates.

- **contexts/**: React context providers for global state (e.g., AuthContext, ThemeContext). Promotes clean state management without prop drilling.

- **routes/**: Centralized route definitions and guards. Makes it easy to manage navigation, lazy loading, and route protection.

- **styles/**: Global and shared style files (e.g., Bootstrap overrides, variables, mixins). Keeps styling organized and maintainable.

- **App.js**: The root component that sets up the main app structure.

- **index.js**: Entry point for rendering the React app.

## How to Use

- Add new features as subfolders in `features/`.
- Place shared components in `components/`.
- Use `config/` to manage all app-level configuration.
- Organize API calls in `services/` for easy maintenance.
- Use `contexts/` for global state and logic.
- Define and manage routes in `routes/`.

This structure is flexible and can be adapted as your project grows. It encourages separation of concerns, modularity, and ease of collaboration. 