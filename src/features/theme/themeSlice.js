/**
 * Theme slice for Redux store
 * Manages application theme state, preferences, and UI settings
 */
import { createSlice } from '@reduxjs/toolkit';

// Initial theme state
const initialState = {
  // Theme settings
  theme: localStorage.getItem('app-theme') || 'light',
  systemTheme: 'light',
  
  // UI preferences
  sidebarCollapsed: false,
  sidebarVisible: true,
  topbarVisible: true,
  footerVisible: false,
  
  // Layout settings
  layout: 'default', // default, compact, wide
  density: 'comfortable', // compact, comfortable, spacious
  
  // Animation preferences
  animationsEnabled: true,
  reducedMotion: false,
  
  // Color scheme
  primaryColor: 'var(--color-primary)',
  accentColor: 'var(--color-accent)',
  
  // Loading states
  isInitializing: false,
  
  // Error state
  error: null,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /**
     * Set theme (light/dark)
     */
    setTheme: (state, action) => {
      const newTheme = action.payload;
      state.theme = newTheme;
      localStorage.setItem('app-theme', newTheme);
      
      // Apply theme to document
      document.body.classList.toggle('dark', newTheme === 'dark');
    },

    /**
     * Toggle between light and dark theme
     */
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('app-theme', newTheme);
      
      // Apply theme to document
      document.body.classList.toggle('dark', newTheme === 'dark');
    },

    /**
     * Set system theme preference
     */
    setSystemTheme: (state, action) => {
      state.systemTheme = action.payload;
    },

    /**
     * Toggle sidebar collapsed state
     */
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    /**
     * Set sidebar collapsed state
     */
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },

    /**
     * Toggle sidebar visibility
     */
    toggleSidebarVisibility: (state) => {
      state.sidebarVisible = !state.sidebarVisible;
    },

    /**
     * Set sidebar visibility
     */
    setSidebarVisible: (state, action) => {
      state.sidebarVisible = action.payload;
    },

    /**
     * Toggle topbar visibility
     */
    toggleTopbarVisibility: (state) => {
      state.topbarVisible = !state.topbarVisible;
    },

    /**
     * Set topbar visibility
     */
    setTopbarVisible: (state, action) => {
      state.topbarVisible = action.payload;
    },

    /**
     * Toggle footer visibility
     */
    toggleFooterVisibility: (state) => {
      state.footerVisible = !state.footerVisible;
    },

    /**
     * Set footer visibility
     */
    setFooterVisible: (state, action) => {
      state.footerVisible = action.payload;
    },

    /**
     * Set layout type
     */
    setLayout: (state, action) => {
      state.layout = action.payload;
    },

    /**
     * Set density preference
     */
    setDensity: (state, action) => {
      state.density = action.payload;
    },

    /**
     * Toggle animations
     */
    toggleAnimations: (state) => {
      state.animationsEnabled = !state.animationsEnabled;
    },

    /**
     * Set animations enabled
     */
    setAnimationsEnabled: (state, action) => {
      state.animationsEnabled = action.payload;
    },

    /**
     * Set reduced motion preference
     */
    setReducedMotion: (state, action) => {
      state.reducedMotion = action.payload;
    },

    /**
     * Set primary color
     */
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
    },

    /**
     * Set accent color
     */
    setAccentColor: (state, action) => {
      state.accentColor = action.payload;
    },

    /**
     * Initialize theme from stored preferences
     */
    initializeTheme: (state) => {
      state.isInitializing = true;
      
      // Load theme from localStorage
      const savedTheme = localStorage.getItem('app-theme');
      if (savedTheme) {
        state.theme = savedTheme;
        document.body.classList.toggle('dark', savedTheme === 'dark');
      }
      
      // Load other preferences
      const savedSidebarCollapsed = localStorage.getItem('sidebar-collapsed');
      if (savedSidebarCollapsed) {
        state.sidebarCollapsed = JSON.parse(savedSidebarCollapsed);
      }
      
      const savedLayout = localStorage.getItem('layout-preference');
      if (savedLayout) {
        state.layout = savedLayout;
      }
      
      const savedDensity = localStorage.getItem('density-preference');
      if (savedDensity) {
        state.density = savedDensity;
      }
      
      const savedAnimations = localStorage.getItem('animations-enabled');
      if (savedAnimations) {
        state.animationsEnabled = JSON.parse(savedAnimations);
      }
      
      state.isInitializing = false;
    },

    /**
     * Reset theme to defaults
     */
    resetTheme: (state) => {
      state.theme = 'light';
      state.sidebarCollapsed = false;
      state.sidebarVisible = true;
      state.topbarVisible = true;
      state.footerVisible = false;
      state.layout = 'default';
      state.density = 'comfortable';
      state.animationsEnabled = true;
      state.reducedMotion = false;
      state.primaryColor = 'var(--color-primary)';
      state.accentColor = 'var(--color-accent)';
      
      // Clear localStorage
      localStorage.removeItem('app-theme');
      localStorage.removeItem('sidebar-collapsed');
      localStorage.removeItem('layout-preference');
      localStorage.removeItem('density-preference');
      localStorage.removeItem('animations-enabled');
      
      // Apply default theme
      document.body.classList.remove('dark');
    },

    /**
     * Clear theme error
     */
    clearThemeError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setTheme,
  toggleTheme,
  setSystemTheme,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarVisibility,
  setSidebarVisible,
  toggleTopbarVisibility,
  setTopbarVisible,
  toggleFooterVisibility,
  setFooterVisible,
  setLayout,
  setDensity,
  toggleAnimations,
  setAnimationsEnabled,
  setReducedMotion,
  setPrimaryColor,
  setAccentColor,
  initializeTheme,
  resetTheme,
  clearThemeError,
} = themeSlice.actions;

// Export reducer
export default themeSlice.reducer;

// Selectors
export const selectTheme = (state) => state.theme.theme;
export const selectSystemTheme = (state) => state.theme.systemTheme;
export const selectSidebarCollapsed = (state) => state.theme.sidebarCollapsed;
export const selectSidebarVisible = (state) => state.theme.sidebarVisible;
export const selectTopbarVisible = (state) => state.theme.topbarVisible;
export const selectFooterVisible = (state) => state.theme.footerVisible;
export const selectLayout = (state) => state.theme.layout;
export const selectDensity = (state) => state.theme.density;
export const selectAnimationsEnabled = (state) => state.theme.animationsEnabled;
export const selectReducedMotion = (state) => state.theme.reducedMotion;
export const selectPrimaryColor = (state) => state.theme.primaryColor;
export const selectAccentColor = (state) => state.theme.accentColor;
export const selectThemeInitializing = (state) => state.theme.isInitializing;
export const selectThemeError = (state) => state.theme.error;

// Computed selectors
export const selectIsDarkTheme = (state) => state.theme.theme === 'dark';
export const selectIsLightTheme = (state) => state.theme.theme === 'light';
export const selectThemeState = (state) => state.theme;

// Layout configuration selector
export const selectLayoutConfig = (state) => ({
  showSidebar: state.theme.sidebarVisible,
  showTopbar: state.theme.topbarVisible,
  showFooter: state.theme.footerVisible,
  sidebarCollapsed: state.theme.sidebarCollapsed,
  layout: state.theme.layout,
  density: state.theme.density,
});
