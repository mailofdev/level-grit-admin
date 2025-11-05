// src/features/client/index.js
// Centralized exports for client feature
export { default as ClientDashboard } from './ClientDashboard';
export { default as ClientMessages } from './ClientMessages';
export { default as clientReducer } from './clientSlice';
export * from './clientSlice'; // Export actions and selectors
export * from './clientThunks'; // Export thunks
export * from './clientMessageService'; // Export message service functions
