/**
 * Redux store configuration
 * Sets up the global state management with middleware, persistence, and dev tools
 */
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import rootReducer from './rootReducer';
import { middleware, listenerMiddleware } from './middleware';

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

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store with middleware and dev tools
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for non-serializable values like functions
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
          'persist/REHYDRATE',
        ],
        ignoredActionsPaths: [
          'meta.arg',
          'payload.timestamp',
          'payload.websocket',
          'payload.socket',
        ],
        ignoredPaths: [
          'items.dates',
          '_persist',
          'messaging.websocket',
          'ui.viewport',
        ],
      },
      // Disable immutable check for performance in development
      immutableCheck: {
        ignoredPaths: ['_persist', 'messaging.websocket'],
      },
    }).concat(middleware),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'Level Grit Admin',
    trace: true,
    traceLimit: 25,
  },
});

// Create persistor
export const persistor = persistStore(store);

// Hot reloading for development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

// Initialize theme on app start
store.dispatch({ type: 'theme/initializeTheme' });

// Set up global error handling
window.addEventListener('unhandledrejection', (event) => {
  store.dispatch({
    type: 'ui/setGlobalError',
    payload: {
      message: 'An unexpected error occurred',
      error: event.reason?.message || 'Unknown error',
      type: 'unhandledrejection',
    },
  });
});

window.addEventListener('error', (event) => {
  store.dispatch({
    type: 'ui/setGlobalError',
    payload: {
      message: 'A JavaScript error occurred',
      error: event.error?.message || 'Unknown error',
      type: 'javascript_error',
    },
  });
});

// Set up viewport tracking
const updateViewport = () => {
  store.dispatch({
    type: 'ui/updateViewport',
    payload: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  });
};

window.addEventListener('resize', updateViewport);
updateViewport(); // Initial call

// Set up keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Toggle shortcuts visibility with Ctrl+/
  if (event.ctrlKey && event.key === '/') {
    event.preventDefault();
    store.dispatch({ type: 'ui/toggleShortcutsVisibility' });
  }
  
  // Toggle theme with Ctrl+Shift+T
  if (event.ctrlKey && event.shiftKey && event.key === 'T') {
    event.preventDefault();
    store.dispatch({ type: 'theme/toggleTheme' });
  }
  
  // Toggle sidebar with Ctrl+Shift+S
  if (event.ctrlKey && event.shiftKey && event.key === 'S') {
    event.preventDefault();
    store.dispatch({ type: 'theme/toggleSidebar' });
  }
});

// Set up storage event listener for cross-tab synchronization
window.addEventListener('storage', (event) => {
  if (event.key === 'persist:root') {
    // Reload the page to sync with other tabs
    window.location.reload();
  }
});

export default store;

// Export types for TypeScript support (if needed in the future)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export listener middleware for use in components
export { listenerMiddleware };
