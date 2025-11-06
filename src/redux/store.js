/**
 * Redux Store Configuration
 * 
 * Centralized state management for the entire application.
 * Uses Redux Toolkit for simplified store setup and best practices.
 * 
 * Features:
 * - Automatic thunk middleware
 * - Redux DevTools integration in development
 * - Immutable state updates
 * - Time-travel debugging
 */

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

/**
 * Creates and configures the Redux store
 * 
 * Redux Toolkit automatically includes:
 * - Redux Thunk middleware for async actions
 * - Redux DevTools Extension integration
 * - Immer for immutable state updates
 * - Serializable state invariant checks (development)
 * 
 * @returns {Object} Configured Redux store
 */
const store = configureStore({
  reducer: rootReducer,
  // Additional middleware can be added here if needed
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...),
  
  // Development-only checks
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
