// src/features/trainer/index.js
// Centralized exports for trainer feature
export { default as TrainerDashboard } from './TrainerDashboard';
export { default as trainerReducer } from './trainerSlice';
export * from './trainerSlice'; // Export actions and selectors
export * from './trainerThunks'; // Export thunks
