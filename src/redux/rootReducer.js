import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import templateReducer from '../features/templates/templateSlice';
const rootReducer = combineReducers({
  auth: authReducer,
   users: userReducer,
   templates: templateReducer
});

export default rootReducer;