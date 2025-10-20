/**
 * Meal Plans slice for Redux store
 * Manages meal plans, recipes, and nutrition data
 */
import { createSlice } from '@reduxjs/toolkit';

// Initial meal plans state
const initialState = {
  // Meal plans data
  mealPlans: [],
  currentMealPlan: null,
  
  // Templates and categories
  templates: [],
  categories: [],
  
  // Recipes and ingredients
  recipes: [],
  ingredients: [],
  
  // Nutrition data
  nutritionData: {},
  dailyNutrition: {},
  
  // Client assignments
  assignments: {}, // clientId -> meal plan assignments
  
  // Search and filters
  searchQuery: '',
  searchResults: [],
  filters: {
    category: null,
    difficulty: null,
    duration: null,
    nutritionType: null,
    tags: [],
  },
  
  // UI states
  selectedMeals: [],
  activeMealPlan: null,
  editingMealPlan: null,
  
  // Form states
  formData: {
    name: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    duration: 7,
    meals: [],
    nutrition: {},
  },
  
  // Loading states
  loading: {
    mealPlans: false,
    templates: false,
    recipes: false,
    ingredients: false,
    nutrition: false,
    assignments: false,
    saving: false,
    deleting: false,
    searching: false,
  },
  
  // Error states
  error: null,
  validationErrors: {},
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  
  // Settings
  settings: {
    autoSave: true,
    showNutrition: true,
    showIngredients: true,
    showInstructions: true,
    defaultDuration: 7,
    defaultDifficulty: 'beginner',
  },
  
  // Cache
  lastUpdated: {
    mealPlans: null,
    templates: null,
    recipes: null,
    ingredients: null,
  },
};

const mealPlansSlice = createSlice({
  name: 'mealPlans',
  initialState,
  reducers: {
    /**
     * Set meal plans
     */
    setMealPlans: (state, action) => {
      state.mealPlans = action.payload;
      state.lastUpdated.mealPlans = new Date().toISOString();
    },

    /**
     * Add or update meal plan
     */
    upsertMealPlan: (state, action) => {
      const mealPlan = action.payload;
      const existingIndex = state.mealPlans.findIndex(mp => mp.id === mealPlan.id);
      
      if (existingIndex >= 0) {
        state.mealPlans[existingIndex] = { ...state.mealPlans[existingIndex], ...mealPlan };
      } else {
        state.mealPlans.unshift(mealPlan);
      }
      
      state.lastUpdated.mealPlans = new Date().toISOString();
    },

    /**
     * Remove meal plan
     */
    removeMealPlan: (state, action) => {
      const mealPlanId = action.payload;
      state.mealPlans = state.mealPlans.filter(mp => mp.id !== mealPlanId);
      state.lastUpdated.mealPlans = new Date().toISOString();
    },

    /**
     * Set current meal plan
     */
    setCurrentMealPlan: (state, action) => {
      state.currentMealPlan = action.payload;
    },

    /**
     * Set templates
     */
    setTemplates: (state, action) => {
      state.templates = action.payload;
      state.lastUpdated.templates = new Date().toISOString();
    },

    /**
     * Set categories
     */
    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    /**
     * Set recipes
     */
    setRecipes: (state, action) => {
      state.recipes = action.payload;
      state.lastUpdated.recipes = new Date().toISOString();
    },

    /**
     * Add or update recipe
     */
    upsertRecipe: (state, action) => {
      const recipe = action.payload;
      const existingIndex = state.recipes.findIndex(r => r.id === recipe.id);
      
      if (existingIndex >= 0) {
        state.recipes[existingIndex] = { ...state.recipes[existingIndex], ...recipe };
      } else {
        state.recipes.unshift(recipe);
      }
      
      state.lastUpdated.recipes = new Date().toISOString();
    },

    /**
     * Remove recipe
     */
    removeRecipe: (state, action) => {
      const recipeId = action.payload;
      state.recipes = state.recipes.filter(r => r.id !== recipeId);
      state.lastUpdated.recipes = new Date().toISOString();
    },

    /**
     * Set ingredients
     */
    setIngredients: (state, action) => {
      state.ingredients = action.payload;
      state.lastUpdated.ingredients = new Date().toISOString();
    },

    /**
     * Set nutrition data
     */
    setNutritionData: (state, action) => {
      state.nutritionData = { ...state.nutritionData, ...action.payload };
    },

    /**
     * Set daily nutrition
     */
    setDailyNutrition: (state, action) => {
      state.dailyNutrition = { ...state.dailyNutrition, ...action.payload };
    },

    /**
     * Set client assignments
     */
    setAssignments: (state, action) => {
      const { clientId, assignments } = action.payload;
      state.assignments[clientId] = assignments;
    },

    /**
     * Add assignment
     */
    addAssignment: (state, action) => {
      const { clientId, assignment } = action.payload;
      if (!state.assignments[clientId]) {
        state.assignments[clientId] = [];
      }
      state.assignments[clientId].push(assignment);
    },

    /**
     * Remove assignment
     */
    removeAssignment: (state, action) => {
      const { clientId, assignmentId } = action.payload;
      if (state.assignments[clientId]) {
        state.assignments[clientId] = state.assignments[clientId].filter(
          a => a.id !== assignmentId
        );
      }
    },

    /**
     * Set search query
     */
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    /**
     * Set search results
     */
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },

    /**
     * Set filters
     */
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    /**
     * Clear filters
     */
    clearFilters: (state) => {
      state.filters = {
        category: null,
        difficulty: null,
        duration: null,
        nutritionType: null,
        tags: [],
      };
    },

    /**
     * Set selected meals
     */
    setSelectedMeals: (state, action) => {
      state.selectedMeals = action.payload;
    },

    /**
     * Toggle meal selection
     */
    toggleMealSelection: (state, action) => {
      const mealId = action.payload;
      const index = state.selectedMeals.indexOf(mealId);
      
      if (index >= 0) {
        state.selectedMeals.splice(index, 1);
      } else {
        state.selectedMeals.push(mealId);
      }
    },

    /**
     * Set active meal plan
     */
    setActiveMealPlan: (state, action) => {
      state.activeMealPlan = action.payload;
    },

    /**
     * Set editing meal plan
     */
    setEditingMealPlan: (state, action) => {
      state.editingMealPlan = action.payload;
    },

    /**
     * Update form data
     */
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    /**
     * Reset form data
     */
    resetFormData: (state) => {
      state.formData = {
        name: '',
        description: '',
        category: '',
        difficulty: 'beginner',
        duration: 7,
        meals: [],
        nutrition: {},
      };
    },

    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      const { type, loading } = action.payload;
      state.loading[type] = loading;
    },

    /**
     * Set error
     */
    setError: (state, action) => {
      state.error = action.payload;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set validation errors
     */
    setValidationErrors: (state, action) => {
      state.validationErrors = { ...state.validationErrors, ...action.payload };
    },

    /**
     * Clear validation errors
     */
    clearValidationErrors: (state) => {
      state.validationErrors = {};
    },

    /**
     * Set pagination
     */
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    /**
     * Update settings
     */
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    /**
     * Clear search
     */
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },

    /**
     * Reset meal plans state
     */
    resetMealPlansState: (state) => {
      return { ...initialState };
    },
  },
});

// Export actions
export const {
  setMealPlans,
  upsertMealPlan,
  removeMealPlan,
  setCurrentMealPlan,
  setTemplates,
  setCategories,
  setRecipes,
  upsertRecipe,
  removeRecipe,
  setIngredients,
  setNutritionData,
  setDailyNutrition,
  setAssignments,
  addAssignment,
  removeAssignment,
  setSearchQuery,
  setSearchResults,
  setFilters,
  clearFilters,
  setSelectedMeals,
  toggleMealSelection,
  setActiveMealPlan,
  setEditingMealPlan,
  updateFormData,
  resetFormData,
  setLoading,
  setError,
  clearError,
  setValidationErrors,
  clearValidationErrors,
  setPagination,
  updateSettings,
  clearSearch,
  resetMealPlansState,
} = mealPlansSlice.actions;

// Export reducer
export default mealPlansSlice.reducer;

// Selectors
export const selectMealPlans = (state) => state.mealPlans.mealPlans;
export const selectCurrentMealPlan = (state) => state.mealPlans.currentMealPlan;
export const selectTemplates = (state) => state.mealPlans.templates;
export const selectCategories = (state) => state.mealPlans.categories;
export const selectRecipes = (state) => state.mealPlans.recipes;
export const selectIngredients = (state) => state.mealPlans.ingredients;
export const selectNutritionData = (state) => state.mealPlans.nutritionData;
export const selectDailyNutrition = (state) => state.mealPlans.dailyNutrition;
export const selectAssignments = (state) => state.mealPlans.assignments;
export const selectClientAssignments = (state, clientId) => state.mealPlans.assignments[clientId] || [];

export const selectSearchQuery = (state) => state.mealPlans.searchQuery;
export const selectSearchResults = (state) => state.mealPlans.searchResults;
export const selectFilters = (state) => state.mealPlans.filters;

export const selectSelectedMeals = (state) => state.mealPlans.selectedMeals;
export const selectActiveMealPlan = (state) => state.mealPlans.activeMealPlan;
export const selectEditingMealPlan = (state) => state.mealPlans.editingMealPlan;
export const selectFormData = (state) => state.mealPlans.formData;

export const selectLoading = (state) => state.mealPlans.loading;
export const selectError = (state) => state.mealPlans.error;
export const selectValidationErrors = (state) => state.mealPlans.validationErrors;
export const selectPagination = (state) => state.mealPlans.pagination;
export const selectSettings = (state) => state.mealPlans.settings;
export const selectLastUpdated = (state) => state.mealPlans.lastUpdated;

// Computed selectors
export const selectMealPlanById = (state, mealPlanId) => 
  state.mealPlans.mealPlans.find(mp => mp.id === mealPlanId);

export const selectRecipeById = (state, recipeId) => 
  state.mealPlans.recipes.find(r => r.id === recipeId);

export const selectMealPlansByCategory = (state, category) => 
  state.mealPlans.mealPlans.filter(mp => mp.category === category);

export const selectRecipesByCategory = (state, category) => 
  state.mealPlans.recipes.filter(r => r.category === category);

export const selectIsLoading = (state, type) => 
  state.mealPlans.loading[type] || false;

export const selectIsMealSelected = (state, mealId) => 
  state.mealPlans.selectedMeals.includes(mealId);

export const selectSelectedMealsCount = (state) => 
  state.mealPlans.selectedMeals.length;

export const selectMealPlansState = (state) => state.mealPlans;
