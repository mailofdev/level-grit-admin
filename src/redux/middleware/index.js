/**
 * Redux middleware configuration
 * Provides enhanced functionality for Redux store
 */
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

// Create listener middleware for side effects
export const listenerMiddleware = createListenerMiddleware();

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme', 'ui'], // Only persist these slices
  transforms: [
    encryptTransform({
      secretKey: process.env.REACT_APP_REDUX_PERSIST_SECRET || 'default-secret-key',
      onError: (error) => {
        console.error('Redux persist encryption error:', error);
      },
    }),
  ],
};

// Auth persist configuration
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'], // Only persist user and auth status
};

// Theme persist configuration
const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['theme', 'sidebarCollapsed', 'layout', 'density'], // Only persist theme preferences
};

// UI persist configuration
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['preferences', 'viewport'], // Only persist user preferences
};

// Logger middleware for development
export const loggerMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Redux Action: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    const result = next(action);
    console.log('Next State:', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

// Analytics middleware for tracking Redux actions
export const analyticsMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Track specific actions for analytics
  const trackableActions = [
    'auth/loginThunk/fulfilled',
    'auth/logout',
    'theme/toggleTheme',
    'ui/showModal',
    'ui/hideModal',
    'messaging/addMessage',
    'dashboard/addRecentActivity',
  ];
  
  if (trackableActions.includes(action.type)) {
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'redux_action', {
        action_type: action.type,
        action_payload: JSON.stringify(action.payload),
      });
    }
  }
  
  return result;
};

// Error handling middleware
export const errorHandlingMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux Error:', error);
    
    // Dispatch error action
    store.dispatch({
      type: 'ui/setGlobalError',
      payload: {
        message: 'An unexpected error occurred',
        error: error.message,
        action: action.type,
      },
    });
    
    // Send error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error monitoring service
      // Sentry.captureException(error, { extra: { action } });
    }
    
    throw error;
  }
};

// Performance monitoring middleware
export const performanceMiddleware = (store) => (next) => (action) => {
  const start = performance.now();
  const result = next(action);
  const end = performance.now();
  
  // Log slow actions
  if (end - start > 10) {
    console.warn(`Slow Redux action: ${action.type} took ${end - start}ms`);
  }
  
  return result;
};

// Undo/Redo middleware
export const undoRedoMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Track undoable actions
  const undoableActions = [
    'mealPlans/upsertMealPlan',
    'mealPlans/removeMealPlan',
    'users/addUser',
    'users/editUser',
    'users/removeUsers',
  ];
  
  if (undoableActions.includes(action.type)) {
    // Store action for undo functionality
    store.dispatch({
      type: 'ui/addToHistory',
      payload: {
        action,
        timestamp: Date.now(),
        state: store.getState(),
      },
    });
  }
  
  return result;
};

// Optimistic updates middleware
export const optimisticUpdatesMiddleware = (store) => (next) => (action) => {
  const optimisticActions = [
    'messaging/addMessage',
    'dashboard/addRecentActivity',
    'mealPlans/upsertMealPlan',
  ];
  
  if (optimisticActions.includes(action.type)) {
    // Apply optimistic update
    const optimisticAction = {
      ...action,
      type: action.type.replace('/fulfilled', '/optimistic'),
      meta: { ...action.meta, optimistic: true },
    };
    
    next(optimisticAction);
  }
  
  return next(action);
};

// Batch actions middleware
export const batchActionsMiddleware = (store) => (next) => (action) => {
  if (action.type === 'BATCH_ACTIONS') {
    action.payload.forEach(batchedAction => {
      store.dispatch(batchedAction);
    });
    return;
  }
  
  return next(action);
};

// WebSocket middleware for real-time updates
export const websocketMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Handle WebSocket actions
  if (action.type.startsWith('websocket/')) {
    const ws = store.getState().messaging?.websocket;
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      switch (action.type) {
        case 'websocket/sendMessage':
          ws.send(JSON.stringify({
            type: 'message',
            payload: action.payload,
          }));
          break;
        case 'websocket/joinRoom':
          ws.send(JSON.stringify({
            type: 'join',
            payload: action.payload,
          }));
          break;
        case 'websocket/leaveRoom':
          ws.send(JSON.stringify({
            type: 'leave',
            payload: action.payload,
          }));
          break;
        default:
          break;
      }
    }
  }
  
  return result;
};

// Export all middleware
export const middleware = [
  listenerMiddleware.middleware,
  loggerMiddleware,
  analyticsMiddleware,
  errorHandlingMiddleware,
  performanceMiddleware,
  undoRedoMiddleware,
  optimisticUpdatesMiddleware,
  batchActionsMiddleware,
  websocketMiddleware,
];

// Export persist configurations
export {
  persistConfig,
  authPersistConfig,
  themePersistConfig,
  uiPersistConfig,
};

// Export listener middleware for use in slices
export { listenerMiddleware };
