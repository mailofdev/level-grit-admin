import { createSlice } from "@reduxjs/toolkit";
import {
  getMealPlanThunk,
  createOrUpdateMealPlanThunk,
  deleteMealsThunk,
  getMealPlanPreviewThunk,
} from "./adjustPlanThunks";

const initialState = {
  // Meal plan data
  meals: [],
  assignedDate: new Date().toISOString().split("T")[0],
  selectedMealIds: [],
  
  // Preview data
  previewData: null,
  
  // Loading states
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  isLoadingPreview: false,
  
  // Error states
  error: null,
  saveError: null,
  deleteError: null,
  previewError: null,
  
  // UI states
  hasUnsavedChanges: false,
  lastFetchedDate: null,
  lastFetchedClientId: null,
};

const adjustPlanSlice = createSlice({
  name: "adjustPlan",
  initialState,
  reducers: {
    // Local state updates (non-async)
    setMeals: (state, action) => {
      state.meals = action.payload;
      state.hasUnsavedChanges = true;
    },
    
    updateMeal: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.meals[index]) {
        state.meals[index][field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    
    addMeal: (state) => {
      state.meals.push({
        mealName: "",
        protein: "",
        fats: "",
        carbs: "",
        calories: "",
        instructions: "",
      });
      state.hasUnsavedChanges = true;
    },
    
    removeMeal: (state, action) => {
      const index = action.payload;
      const meal = state.meals[index];
      
      // If meal has ID (exists in DB), mark for deletion
      if (meal?.id) {
        if (!state.selectedMealIds.includes(meal.id)) {
          state.selectedMealIds.push(meal.id);
        } else {
          // Unmark if already selected
          state.selectedMealIds = state.selectedMealIds.filter(
            (id) => id !== meal.id
          );
        }
      } else {
        // For new meals without ID, remove immediately
        state.meals = state.meals.filter((_, i) => i !== index);
        state.hasUnsavedChanges = true;
      }
    },
    
    setAssignedDate: (state, action) => {
      state.assignedDate = action.payload;
    },
    
    clearSelectedMeals: (state) => {
      state.selectedMealIds = [];
    },
    
    clearErrors: (state) => {
      state.error = null;
      state.saveError = null;
      state.deleteError = null;
      state.previewError = null;
    },
    
    resetUnsavedChanges: (state) => {
      state.hasUnsavedChanges = false;
    },
    
    resetState: () => initialState,
  },
  
  extraReducers: (builder) => {
    // ==================== GET MEAL PLAN ====================
    builder
      .addCase(getMealPlanThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMealPlanThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meals = action.payload?.meals?.length > 0 
          ? action.payload.meals 
          : [{
              mealName: "",
              protein: "",
              fats: "",
              carbs: "",
              calories: "",
              instructions: "",
            }];
        state.selectedMealIds = [];
        state.hasUnsavedChanges = false;
        state.error = null;
        
        // Track last fetched data
        state.lastFetchedDate = state.assignedDate;
        state.lastFetchedClientId = action.meta.arg.clientId;
      })
      .addCase(getMealPlanThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch meal plan";
        // Set empty meal on error
        state.meals = [{
          mealName: "",
          protein: "",
          fats: "",
          carbs: "",
          calories: "",
          instructions: "",
        }];
      });

    // ==================== CREATE/UPDATE MEAL PLAN ====================
    builder
      .addCase(createOrUpdateMealPlanThunk.pending, (state) => {
        state.isSaving = true;
        state.saveError = null;
      })
      .addCase(createOrUpdateMealPlanThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        state.hasUnsavedChanges = false;
        state.saveError = null;
        // Optionally update meals with returned data if API sends back updated meals
        if (action.payload?.meals) {
          state.meals = action.payload.meals;
        }
      })
      .addCase(createOrUpdateMealPlanThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.saveError = action.payload || "Failed to save meal plan";
      });

    // ==================== DELETE MEALS ====================
    builder
      .addCase(deleteMealsThunk.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteMealsThunk.fulfilled, (state) => {
        state.isDeleting = false;
        // Remove deleted meals from state
        state.meals = state.meals.filter(
          (meal) => !state.selectedMealIds.includes(meal.id)
        );
        state.selectedMealIds = [];
        state.deleteError = null;
        state.hasUnsavedChanges = false;
      })
      .addCase(deleteMealsThunk.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload || "Failed to delete meals";
      });

    // ==================== GET PREVIEW ====================
    builder
      .addCase(getMealPlanPreviewThunk.pending, (state) => {
        state.isLoadingPreview = true;
        state.previewError = null;
      })
      .addCase(getMealPlanPreviewThunk.fulfilled, (state, action) => {
        state.isLoadingPreview = false;
        state.previewData = action.payload;
        state.previewError = null;
      })
      .addCase(getMealPlanPreviewThunk.rejected, (state, action) => {
        state.isLoadingPreview = false;
        state.previewError = action.payload || "Failed to load preview";
        state.previewData = null;
      });
  },
});

// Export actions
export const {
  setMeals,
  updateMeal,
  addMeal,
  removeMeal,
  setAssignedDate,
  clearSelectedMeals,
  clearErrors,
  resetUnsavedChanges,
  resetState,
} = adjustPlanSlice.actions;

// Selectors
export const selectMeals = (state) => state.adjustPlan.meals;
export const selectAssignedDate = (state) => state.adjustPlan.assignedDate;
export const selectSelectedMealIds = (state) => state.adjustPlan.selectedMealIds;
export const selectPreviewData = (state) => state.adjustPlan.previewData;

export const selectIsLoading = (state) => state.adjustPlan.isLoading;
export const selectIsSaving = (state) => state.adjustPlan.isSaving;
export const selectIsDeleting = (state) => state.adjustPlan.isDeleting;
export const selectIsLoadingPreview = (state) => state.adjustPlan.isLoadingPreview;

export const selectError = (state) => state.adjustPlan.error;
export const selectSaveError = (state) => state.adjustPlan.saveError;
export const selectDeleteError = (state) => state.adjustPlan.deleteError;
export const selectPreviewError = (state) => state.adjustPlan.previewError;

export const selectHasUnsavedChanges = (state) => state.adjustPlan.hasUnsavedChanges;

// Computed selectors
export const selectActiveMeals = (state) => {
  const meals = state.adjustPlan.meals;
  const selectedIds = state.adjustPlan.selectedMealIds;
  return meals.filter((meal) => !selectedIds.includes(meal?.id));
};

export const selectTotals = (state) => {
  const activeMeals = selectActiveMeals(state);
  return activeMeals.reduce(
    (acc, meal) => {
      acc.protein += Number(meal.protein) || 0;
      acc.fats += Number(meal.fats) || 0;
      acc.carbs += Number(meal.carbs) || 0;
      acc.calories += Number(meal.calories) || 0;
      return acc;
    },
    { protein: 0, fats: 0, carbs: 0, calories: 0 }
  );
};

export const selectHasSelectedMeals = (state) => 
  state.adjustPlan.selectedMealIds.length > 0;

export const selectIsAnyOperationInProgress = (state) =>
  state.adjustPlan.isLoading ||
  state.adjustPlan.isSaving ||
  state.adjustPlan.isDeleting ||
  state.adjustPlan.isLoadingPreview;

export default adjustPlanSlice.reducer;