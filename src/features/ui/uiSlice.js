/**
 * UI slice for Redux store
 * Manages global UI state, modals, notifications, and user interactions
 */
import { createSlice } from '@reduxjs/toolkit';

// Initial UI state
const initialState = {
  // Loading states
  globalLoading: false,
  loadingStates: {}, // Component-specific loading states
  
  // Modal states
  modals: {
    // Auth modals
    loginModal: false,
    registerModal: false,
    forgotPasswordModal: false,
    
    // User modals
    profileModal: false,
    settingsModal: false,
    logoutModal: false,
    
    // Data modals
    confirmModal: false,
    deleteModal: false,
    editModal: false,
    
    // Custom modals
    customModal: false,
  },
  
  // Notification states
  notifications: [],
  toastQueue: [],
  
  // Search and filter states
  globalSearch: '',
  searchFilters: {},
  
  // Navigation states
  activeRoute: '/',
  breadcrumbs: [],
  navigationHistory: [],
  
  // Form states
  formStates: {}, // Component-specific form states
  
  // Error states
  globalError: null,
  componentErrors: {},
  
  // Success states
  globalSuccess: null,
  componentSuccess: {},
  
  // User preferences
  preferences: {
    autoSave: true,
    showTooltips: true,
    compactMode: false,
    showNotifications: true,
    soundEnabled: true,
  },
  
  // Viewport and responsive states
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  },
  
  // Keyboard shortcuts
  shortcuts: {
    enabled: true,
    visible: false,
  },
  
  // Accessibility
  accessibility: {
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Set global loading state
     */
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    /**
     * Set component-specific loading state
     */
    setComponentLoading: (state, action) => {
      const { component, loading } = action.payload;
      state.loadingStates[component] = loading;
    },

    /**
     * Clear all loading states
     */
    clearLoadingStates: (state) => {
      state.globalLoading = false;
      state.loadingStates = {};
    },

    /**
     * Show modal
     */
    showModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },

    /**
     * Hide modal
     */
    hideModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },

    /**
     * Toggle modal
     */
    toggleModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = !state.modals[modalName];
      }
    },

    /**
     * Hide all modals
     */
    hideAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },

    /**
     * Add notification
     */
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },

    /**
     * Remove notification
     */
    removeNotification: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== id);
    },

    /**
     * Clear all notifications
     */
    clearNotifications: (state) => {
      state.notifications = [];
    },

    /**
     * Add toast message
     */
    addToast: (state, action) => {
      const toast = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.toastQueue.push(toast);
    },

    /**
     * Remove toast message
     */
    removeToast: (state, action) => {
      const id = action.payload;
      state.toastQueue = state.toastQueue.filter(t => t.id !== id);
    },

    /**
     * Clear all toasts
     */
    clearToasts: (state) => {
      state.toastQueue = [];
    },

    /**
     * Set global search
     */
    setGlobalSearch: (state, action) => {
      state.globalSearch = action.payload;
    },

    /**
     * Set search filters
     */
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },

    /**
     * Clear search filters
     */
    clearSearchFilters: (state) => {
      state.searchFilters = {};
    },

    /**
     * Set active route
     */
    setActiveRoute: (state, action) => {
      state.activeRoute = action.payload;
      
      // Add to navigation history
      if (state.navigationHistory[state.navigationHistory.length - 1] !== action.payload) {
        state.navigationHistory.push(action.payload);
        
        // Keep only last 10 routes
        if (state.navigationHistory.length > 10) {
          state.navigationHistory = state.navigationHistory.slice(-10);
        }
      }
    },

    /**
     * Set breadcrumbs
     */
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },

    /**
     * Set form state
     */
    setFormState: (state, action) => {
      const { formName, formState } = action.payload;
      state.formStates[formName] = formState;
    },

    /**
     * Clear form state
     */
    clearFormState: (state, action) => {
      const formName = action.payload;
      delete state.formStates[formName];
    },

    /**
     * Set global error
     */
    setGlobalError: (state, action) => {
      state.globalError = action.payload;
    },

    /**
     * Set component error
     */
    setComponentError: (state, action) => {
      const { component, error } = action.payload;
      state.componentErrors[component] = error;
    },

    /**
     * Clear global error
     */
    clearGlobalError: (state) => {
      state.globalError = null;
    },

    /**
     * Clear component error
     */
    clearComponentError: (state, action) => {
      const component = action.payload;
      delete state.componentErrors[component];
    },

    /**
     * Clear all errors
     */
    clearAllErrors: (state) => {
      state.globalError = null;
      state.componentErrors = {};
    },

    /**
     * Set global success message
     */
    setGlobalSuccess: (state, action) => {
      state.globalSuccess = action.payload;
    },

    /**
     * Set component success message
     */
    setComponentSuccess: (state, action) => {
      const { component, success } = action.payload;
      state.componentSuccess[component] = success;
    },

    /**
     * Clear global success
     */
    clearGlobalSuccess: (state) => {
      state.globalSuccess = null;
    },

    /**
     * Clear component success
     */
    clearComponentSuccess: (state, action) => {
      const component = action.payload;
      delete state.componentSuccess[component];
    },

    /**
     * Clear all success messages
     */
    clearAllSuccess: (state) => {
      state.globalSuccess = null;
      state.componentSuccess = {};
    },

    /**
     * Update user preferences
     */
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    /**
     * Reset preferences to defaults
     */
    resetPreferences: (state) => {
      state.preferences = {
        autoSave: true,
        showTooltips: true,
        compactMode: false,
        showNotifications: true,
        soundEnabled: true,
      };
    },

    /**
     * Update viewport information
     */
    updateViewport: (state, action) => {
      const { width, height } = action.payload;
      state.viewport = {
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      };
    },

    /**
     * Toggle keyboard shortcuts visibility
     */
    toggleShortcutsVisibility: (state) => {
      state.shortcuts.visible = !state.shortcuts.visible;
    },

    /**
     * Set keyboard shortcuts enabled
     */
    setShortcutsEnabled: (state, action) => {
      state.shortcuts.enabled = action.payload;
    },

    /**
     * Update accessibility settings
     */
    updateAccessibility: (state, action) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
    },

    /**
     * Reset UI state to initial
     */
    resetUIState: (state) => {
      return { ...initialState, viewport: state.viewport };
    },
  },
});

// Export actions
export const {
  setGlobalLoading,
  setComponentLoading,
  clearLoadingStates,
  showModal,
  hideModal,
  toggleModal,
  hideAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  addToast,
  removeToast,
  clearToasts,
  setGlobalSearch,
  setSearchFilters,
  clearSearchFilters,
  setActiveRoute,
  setBreadcrumbs,
  setFormState,
  clearFormState,
  setGlobalError,
  setComponentError,
  clearGlobalError,
  clearComponentError,
  clearAllErrors,
  setGlobalSuccess,
  setComponentSuccess,
  clearGlobalSuccess,
  clearComponentSuccess,
  clearAllSuccess,
  updatePreferences,
  resetPreferences,
  updateViewport,
  toggleShortcutsVisibility,
  setShortcutsEnabled,
  updateAccessibility,
  resetUIState,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;

// Selectors
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectComponentLoading = (state, component) => state.ui.loadingStates[component];
export const selectLoadingStates = (state) => state.ui.loadingStates;

export const selectModals = (state) => state.ui.modals;
export const selectModal = (state, modalName) => state.ui.modals[modalName];

export const selectNotifications = (state) => state.ui.notifications;
export const selectToastQueue = (state) => state.ui.toastQueue;

export const selectGlobalSearch = (state) => state.ui.globalSearch;
export const selectSearchFilters = (state) => state.ui.searchFilters;

export const selectActiveRoute = (state) => state.ui.activeRoute;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;
export const selectNavigationHistory = (state) => state.ui.navigationHistory;

export const selectFormState = (state, formName) => state.ui.formStates[formName];
export const selectFormStates = (state) => state.ui.formStates;

export const selectGlobalError = (state) => state.ui.globalError;
export const selectComponentError = (state, component) => state.ui.componentErrors[component];
export const selectComponentErrors = (state) => state.ui.componentErrors;

export const selectGlobalSuccess = (state) => state.ui.globalSuccess;
export const selectComponentSuccess = (state, component) => state.ui.componentSuccess[component];
export const selectComponentSuccesses = (state) => state.ui.componentSuccess;

export const selectPreferences = (state) => state.ui.preferences;
export const selectViewport = (state) => state.ui.viewport;
export const selectShortcuts = (state) => state.ui.shortcuts;
export const selectAccessibility = (state) => state.ui.accessibility;

// Computed selectors
export const selectIsLoading = (state, component) => {
  return state.ui.globalLoading || (component && state.ui.loadingStates[component]);
};

export const selectAnyModalOpen = (state) => {
  return Object.values(state.ui.modals).some(open => open);
};

export const selectHasNotifications = (state) => {
  return state.ui.notifications.length > 0;
};

export const selectHasToasts = (state) => {
  return state.ui.toastQueue.length > 0;
};

export const selectIsMobile = (state) => state.ui.viewport.isMobile;
export const selectIsTablet = (state) => state.ui.viewport.isTablet;
export const selectIsDesktop = (state) => state.ui.viewport.isDesktop;
