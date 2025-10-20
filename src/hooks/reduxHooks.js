/**
 * Custom Redux hooks for better developer experience
 * Provides typed and optimized hooks for Redux state management
 */
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useCallback, useMemo } from 'react';

// Auth hooks
export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth, shallowEqual);
  
  return useMemo(() => ({
    ...authState,
    dispatch,
  }), [authState, dispatch]);
};

export const useAuthActions = () => {
  const dispatch = useDispatch();
  
  return useMemo(() => ({
    login: (credentials) => dispatch({ type: 'auth/loginThunk', payload: credentials }),
    logout: () => dispatch({ type: 'auth/logout' }),
    clearError: () => dispatch({ type: 'auth/clearError' }),
    updateProfile: (data) => dispatch({ type: 'auth/updateProfileThunk', payload: data }),
  }), [dispatch]);
};

// Theme hooks
export const useTheme = () => {
  const dispatch = useDispatch();
  const themeState = useSelector(state => state.theme, shallowEqual);
  
  return useMemo(() => ({
    ...themeState,
    dispatch,
  }), [themeState, dispatch]);
};

export const useThemeActions = () => {
  const dispatch = useDispatch();
  
  return useMemo(() => ({
    toggleTheme: () => dispatch({ type: 'theme/toggleTheme' }),
    setTheme: (theme) => dispatch({ type: 'theme/setTheme', payload: theme }),
    toggleSidebar: () => dispatch({ type: 'theme/toggleSidebar' }),
    setSidebarCollapsed: (collapsed) => dispatch({ type: 'theme/setSidebarCollapsed', payload: collapsed }),
    initializeTheme: () => dispatch({ type: 'theme/initializeTheme' }),
  }), [dispatch]);
};

// UI hooks
export const useUI = () => {
  const dispatch = useDispatch();
  const uiState = useSelector(state => state.ui, shallowEqual);
  
  return useMemo(() => ({
    ...uiState,
    dispatch,
  }), [uiState, dispatch]);
};

export const useUIActions = () => {
  const dispatch = useDispatch();
  
  return useMemo(() => ({
    setGlobalLoading: (loading) => dispatch({ type: 'ui/setGlobalLoading', payload: loading }),
    setComponentLoading: (component, loading) => dispatch({ type: 'ui/setComponentLoading', payload: { component, loading } }),
    showModal: (modalName) => dispatch({ type: 'ui/showModal', payload: modalName }),
    hideModal: (modalName) => dispatch({ type: 'ui/hideModal', payload: modalName }),
    hideAllModals: () => dispatch({ type: 'ui/hideAllModals' }),
    addNotification: (notification) => dispatch({ type: 'ui/addNotification', payload: notification }),
    removeNotification: (id) => dispatch({ type: 'ui/removeNotification', payload: id }),
    addToast: (toast) => dispatch({ type: 'ui/addToast', payload: toast }),
    removeToast: (id) => dispatch({ type: 'ui/removeToast', payload: id }),
    setGlobalError: (error) => dispatch({ type: 'ui/setGlobalError', payload: error }),
    clearGlobalError: () => dispatch({ type: 'ui/clearGlobalError' }),
    setGlobalSuccess: (success) => dispatch({ type: 'ui/setGlobalSuccess', payload: success }),
    clearGlobalSuccess: () => dispatch({ type: 'ui/clearGlobalSuccess' }),
    updatePreferences: (preferences) => dispatch({ type: 'ui/updatePreferences', payload: preferences }),
  }), [dispatch]);
};

// Messaging hooks
export const useMessaging = () => {
  const dispatch = useDispatch();
  const messagingState = useSelector(state => state.messaging, shallowEqual);
  
  return useMemo(() => ({
    ...messagingState,
    dispatch,
  }), [messagingState, dispatch]);
};

export const useMessagingActions = () => {
  const dispatch = useDispatch();
  
  return useMemo(() => ({
    setConnectionStatus: (status) => dispatch({ type: 'messaging/setConnectionStatus', payload: status }),
    setConversations: (conversations) => dispatch({ type: 'messaging/setConversations', payload: conversations }),
    setActiveConversation: (conversation) => dispatch({ type: 'messaging/setActiveConversation', payload: conversation }),
    addMessage: (conversationId, message) => dispatch({ type: 'messaging/addMessage', payload: { conversationId, message } }),
    markMessagesAsRead: (conversationId, messageIds) => dispatch({ type: 'messaging/markMessagesAsRead', payload: { conversationId, messageIds } }),
    setTyping: (conversationId, userId, isTyping) => dispatch({ type: 'messaging/setTyping', payload: { conversationId, userId, isTyping } }),
    addNotification: (notification) => dispatch({ type: 'messaging/addNotification', payload: notification }),
    removeNotification: (id) => dispatch({ type: 'messaging/removeNotification', payload: id }),
  }), [dispatch]);
};

// Dashboard hooks
export const useDashboard = () => {
  const dispatch = useDispatch();
  const dashboardState = useSelector(state => state.dashboard, shallowEqual);
  
  return useMemo(() => ({
    ...dashboardState,
    dispatch,
  }), [dashboardState, dispatch]);
};

export const useDashboardActions = () => {
  const dispatch = useDispatch();
  
  return useMemo(() => ({
    setStats: (stats) => dispatch({ type: 'dashboard/setStats', payload: stats }),
    setChartData: (chartType, data) => dispatch({ type: 'dashboard/setChartData', payload: { chartType, data } }),
    setRecentActivities: (activities) => dispatch({ type: 'dashboard/setRecentActivities', payload: activities }),
    addRecentActivity: (activity) => dispatch({ type: 'dashboard/addRecentActivity', payload: activity }),
    addNotification: (notification) => dispatch({ type: 'dashboard/addNotification', payload: notification }),
    markNotificationAsRead: (id) => dispatch({ type: 'dashboard/markNotificationAsRead', payload: id }),
    removeNotification: (id) => dispatch({ type: 'dashboard/removeNotification', payload: id }),
    updateWidget: (widgetId, config) => dispatch({ type: 'dashboard/updateWidget', payload: { widgetId, config } }),
    toggleWidgetVisibility: (widgetId) => dispatch({ type: 'dashboard/toggleWidgetVisibility', payload: widgetId }),
    refreshDashboard: () => dispatch({ type: 'dashboard/refreshDashboard' }),
  }), [dispatch]);
};

// Meal Plans hooks
export const useMealPlans = () => {
  const dispatch = useDispatch();
  const mealPlansState = useSelector(state => state.mealPlans, shallowEqual);
  
  return useMemo(() => ({
    ...mealPlansState,
    dispatch,
  }), [mealPlansState, dispatch]);
};

export const useMealPlansActions = () => {
  const dispatch = useDispatch();
  
  return useMemo(() => ({
    setMealPlans: (mealPlans) => dispatch({ type: 'mealPlans/setMealPlans', payload: mealPlans }),
    upsertMealPlan: (mealPlan) => dispatch({ type: 'mealPlans/upsertMealPlan', payload: mealPlan }),
    removeMealPlan: (id) => dispatch({ type: 'mealPlans/removeMealPlan', payload: id }),
    setCurrentMealPlan: (mealPlan) => dispatch({ type: 'mealPlans/setCurrentMealPlan', payload: mealPlan }),
    setRecipes: (recipes) => dispatch({ type: 'mealPlans/setRecipes', payload: recipes }),
    upsertRecipe: (recipe) => dispatch({ type: 'mealPlans/upsertRecipe', payload: recipe }),
    removeRecipe: (id) => dispatch({ type: 'mealPlans/removeRecipe', payload: id }),
    setSelectedMeals: (meals) => dispatch({ type: 'mealPlans/setSelectedMeals', payload: meals }),
    toggleMealSelection: (mealId) => dispatch({ type: 'mealPlans/toggleMealSelection', payload: mealId }),
    updateFormData: (data) => dispatch({ type: 'mealPlans/updateFormData', payload: data }),
    resetFormData: () => dispatch({ type: 'mealPlans/resetFormData' }),
    setLoading: (type, loading) => dispatch({ type: 'mealPlans/setLoading', payload: { type, loading } }),
    setError: (error) => dispatch({ type: 'mealPlans/setError', payload: error }),
    clearError: () => dispatch({ type: 'mealPlans/clearError' }),
  }), [dispatch]);
};

// Users hooks
export const useUsers = () => {
  const dispatch = useDispatch();
  const usersState = useSelector(state => state.users, shallowEqual);
  
  return useMemo(() => ({
    ...usersState,
    dispatch,
  }), [usersState, dispatch]);
};

export const useUsersActions = () => {
  const dispatch = useDispatch();
  
  return useMemo(() => ({
    fetchUsers: () => dispatch({ type: 'users/fetchUsers' }),
    fetchUserById: (id) => dispatch({ type: 'users/fetchUserById', payload: id }),
    addUser: (user) => dispatch({ type: 'users/addUser', payload: user }),
    editUser: (id, data) => dispatch({ type: 'users/editUser', payload: { id, data } }),
    removeUsers: (ids) => dispatch({ type: 'users/removeUsers', payload: ids }),
    clearCurrentUser: () => dispatch({ type: 'users/clearCurrentUser' }),
  }), [dispatch]);
};

// Adjust Plan hooks
export const useAdjustPlan = () => {
  const dispatch = useDispatch();
  const adjustPlanState = useSelector(state => state.adjustPlan, shallowEqual);
  
  return useMemo(() => ({
    ...adjustPlanState,
    dispatch,
  }), [adjustPlanState, dispatch]);
};

export const useAdjustPlanActions = () => {
  const dispatch = useDispatch();
  
  return useMemo(() => ({
    setMeals: (meals) => dispatch({ type: 'adjustPlan/setMeals', payload: meals }),
    updateMeal: (index, field, value) => dispatch({ type: 'adjustPlan/updateMeal', payload: { index, field, value } }),
    addMeal: () => dispatch({ type: 'adjustPlan/addMeal' }),
    removeMeal: (index) => dispatch({ type: 'adjustPlan/removeMeal', payload: index }),
    setAssignedDate: (date) => dispatch({ type: 'adjustPlan/setAssignedDate', payload: date }),
    setHasUnsavedChanges: (hasChanges) => dispatch({ type: 'adjustPlan/setHasUnsavedChanges', payload: hasChanges }),
    setLoading: (type, loading) => dispatch({ type: 'adjustPlan/setLoading', payload: { type, loading } }),
    setError: (error) => dispatch({ type: 'adjustPlan/setError', payload: error }),
    clearError: () => dispatch({ type: 'adjustPlan/clearError' }),
  }), [dispatch]);
};

// Generic hooks for any slice
export const useSlice = (sliceName) => {
  const dispatch = useDispatch();
  const sliceState = useSelector(state => state[sliceName], shallowEqual);
  
  return useMemo(() => ({
    ...sliceState,
    dispatch,
  }), [sliceState, dispatch]);
};

// Hook for dispatching actions
export const useActions = (actions) => {
  const dispatch = useDispatch();
  
  return useMemo(() => {
    const boundActions = {};
    Object.keys(actions).forEach(key => {
      boundActions[key] = useCallback((...args) => {
        const action = actions[key](...args);
        return dispatch(action);
      }, [dispatch]);
    });
    return boundActions;
  }, [dispatch, actions]);
};

// Hook for selecting specific state with memoization
export const useSelect = (selector, equalityFn = shallowEqual) => {
  return useSelector(selector, equalityFn);
};

// Hook for dispatching actions with memoization
export const useDispatchAction = (actionCreator) => {
  const dispatch = useDispatch();
  
  return useCallback((...args) => {
    const action = actionCreator(...args);
    return dispatch(action);
  }, [dispatch, actionCreator]);
};

// Hook for multiple selectors
export const useSelectors = (selectors) => {
  const results = {};
  
  Object.keys(selectors).forEach(key => {
    results[key] = useSelector(selectors[key], shallowEqual);
  });
  
  return results;
};

// Hook for loading states
export const useLoading = (sliceName, loadingType) => {
  return useSelector(state => state[sliceName]?.loading?.[loadingType] || false);
};

// Hook for error states
export const useError = (sliceName) => {
  return useSelector(state => state[sliceName]?.error || null);
};

// Hook for checking if any loading is active
export const useAnyLoading = (sliceNames) => {
  return useSelector(state => {
    return sliceNames.some(sliceName => {
      const loading = state[sliceName]?.loading;
      return loading && Object.values(loading).some(Boolean);
    });
  });
};

// Hook for checking if any error exists
export const useAnyError = (sliceNames) => {
  return useSelector(state => {
    return sliceNames.some(sliceName => {
      return !!state[sliceName]?.error;
    });
  });
};
