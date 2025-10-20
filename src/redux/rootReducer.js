/**
 * Root reducer for Redux store
 * Combines all feature reducers into a single state tree
 */
import { combineReducers } from 'redux';

// Feature reducers
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import adjustPlanReducer from '../features/adjustPlan/adjustPlanSlice';
import themeReducer from '../features/theme/themeSlice';
import uiReducer from '../features/ui/uiSlice';
import messagingReducer from '../features/messaging/messagingSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import mealPlansReducer from '../features/mealPlans/mealPlansSlice';

// Combine all reducers
const rootReducer = combineReducers({
  // Authentication and user management
  auth: authReducer,
  users: userReducer,
  
  // UI and theme management
  theme: themeReducer,
  ui: uiReducer,
  
  // Feature-specific reducers
  adjustPlan: adjustPlanReducer,
  messaging: messagingReducer,
  dashboard: dashboardReducer,
  mealPlans: mealPlansReducer,
});

export default rootReducer;