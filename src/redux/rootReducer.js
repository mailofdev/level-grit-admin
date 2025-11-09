/**
 * Root Reducer
 * 
 * Combines all feature-specific reducers into a single root reducer.
 * This is the main reducer that manages the entire application state.
 * 
 * State Structure:
 * {
 *   auth: Authentication state (user, token, loading, errors)
 *   users: User management state (clients list, current user)
 *   adjustPlan: Meal plan adjustment state
 *   trainer: Trainer dashboard and data state
 *   client: Client dashboard and data state
 * }
 */

import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import adjustPlanReducer from "../features/adjustPlan/adjustPlanSlice";
import trainerReducer from '../features/trainer/trainerSlice';
import clientReducer from '../features/users/clientSlice';
/**
 * Root reducer combining all feature reducers
 * 
 * Each reducer manages a specific slice of the application state:
 * - auth: Login, registration, authentication status
 * - users: Client list, user profiles
 * - adjustPlan: Meal plan creation and updates
 * - trainer: Trainer dashboard data
 * - client: Client dashboard data
 */
const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  adjustPlan: adjustPlanReducer,
  trainer: trainerReducer,
  client: clientReducer,
});

export default rootReducer;
