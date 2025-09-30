import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import adjustPlanReducer from "../features/adjustPlan/adjustPlanSlice";
const rootReducer = combineReducers({
  auth: authReducer,
   users: userReducer,
   adjustPlan: adjustPlanReducer,
});

export default rootReducer;