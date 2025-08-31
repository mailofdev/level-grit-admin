import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
const rootReducer = combineReducers({
  auth: authReducer,
   users: userReducer,
});

export default rootReducer;