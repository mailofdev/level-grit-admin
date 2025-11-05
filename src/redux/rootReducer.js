import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import adjustPlanReducer from "../features/adjustPlan/adjustPlanSlice";
import trainerReducer from '../features/trainer/trainerSlice';
import clientReducer  from '../features/client/clientSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  adjustPlan: adjustPlanReducer,
  trainer: trainerReducer,
  client: clientReducer,
});

export default rootReducer;