/**
 * Root Reducer - Client Portal
 * 
 * Combines all feature-specific reducers into a single root reducer.
 * This is the main reducer that manages the entire application state.
 * 
 * State Structure:
 * {
 *   auth: Authentication state (user, token, loading, errors)
 *   users: User management state (current user)
 *   adjustPlan: Meal plan adjustment state
 *   client: Client dashboard and data state
 * }
 */

import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import adjustPlanReducer from "../features/adjustPlan/adjustPlanSlice";
import clientReducer from '../features/client/clientSlice';

/**
 * Root reducer combining all feature reducers
 * 
 * Each reducer manages a specific slice of the application state:
 * - auth: Login, registration, authentication status
 * - users: User profiles and data
 * - adjustPlan: Meal plan creation and updates
 * - client: Client dashboard data and messages
 */
const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  adjustPlan: adjustPlanReducer,
  client: clientReducer,
});

export default rootReducer;
