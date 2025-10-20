/**
 * Dashboard slice for Redux store
 * Manages dashboard data, widgets, and analytics
 */
import { createSlice } from '@reduxjs/toolkit';

// Initial dashboard state
const initialState = {
  // Dashboard data
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    totalTrainers: 0,
    totalClients: 0,
    totalMealPlans: 0,
    totalMessages: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    dailyRevenue: 0,
  },
  
  // Charts and analytics data
  charts: {
    userGrowth: [],
    revenueChart: [],
    activityChart: [],
    mealPlanChart: [],
    messageChart: [],
  },
  
  // Recent activities
  recentActivities: [],
  
  // Notifications and alerts
  notifications: [],
  alerts: [],
  
  // Widget configuration
  widgets: {
    userStats: { visible: true, position: 0 },
    revenueChart: { visible: true, position: 1 },
    recentActivities: { visible: true, position: 2 },
    mealPlanStats: { visible: true, position: 3 },
    messageStats: { visible: true, position: 4 },
    userGrowth: { visible: true, position: 5 },
    activityChart: { visible: true, position: 6 },
    notifications: { visible: true, position: 7 },
  },
  
  // Dashboard settings
  settings: {
    refreshInterval: 30000, // 30 seconds
    autoRefresh: true,
    showCharts: true,
    showStats: true,
    showActivities: true,
    dateRange: '7d', // 1d, 7d, 30d, 90d, 1y
    timezone: 'UTC',
  },
  
  // Loading states
  loading: {
    stats: false,
    charts: false,
    activities: false,
    notifications: false,
    refreshing: false,
  },
  
  // Error states
  error: null,
  
  // Cache timestamps
  lastUpdated: {
    stats: null,
    charts: null,
    activities: null,
    notifications: null,
  },
  
  // Real-time updates
  realTimeEnabled: true,
  lastActivityTimestamp: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    /**
     * Set dashboard stats
     */
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
      state.lastUpdated.stats = new Date().toISOString();
    },

    /**
     * Set chart data
     */
    setChartData: (state, action) => {
      const { chartType, data } = action.payload;
      state.charts[chartType] = data;
      state.lastUpdated.charts = new Date().toISOString();
    },

    /**
     * Set all charts data
     */
    setAllChartsData: (state, action) => {
      state.charts = { ...state.charts, ...action.payload };
      state.lastUpdated.charts = new Date().toISOString();
    },

    /**
     * Set recent activities
     */
    setRecentActivities: (state, action) => {
      state.recentActivities = action.payload;
      state.lastUpdated.activities = new Date().toISOString();
    },

    /**
     * Add recent activity
     */
    addRecentActivity: (state, action) => {
      const activity = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.recentActivities.unshift(activity);
      
      // Keep only last 50 activities
      if (state.recentActivities.length > 50) {
        state.recentActivities = state.recentActivities.slice(0, 50);
      }
    },

    /**
     * Set notifications
     */
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.lastUpdated.notifications = new Date().toISOString();
    },

    /**
     * Add notification
     */
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(notification);
    },

    /**
     * Mark notification as read
     */
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
      }
    },

    /**
     * Remove notification
     */
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },

    /**
     * Clear all notifications
     */
    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    /**
     * Set alerts
     */
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },

    /**
     * Add alert
     */
    addAlert: (state, action) => {
      const alert = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        dismissed: false,
        ...action.payload,
      };
      state.alerts.unshift(alert);
    },

    /**
     * Dismiss alert
     */
    dismissAlert: (state, action) => {
      const alertId = action.payload;
      const alert = state.alerts.find(a => a.id === alertId);
      if (alert) {
        alert.dismissed = true;
        alert.dismissedAt = new Date().toISOString();
      }
    },

    /**
     * Remove alert
     */
    removeAlert: (state, action) => {
      const alertId = action.payload;
      state.alerts = state.alerts.filter(a => a.id !== alertId);
    },

    /**
     * Update widget configuration
     */
    updateWidget: (state, action) => {
      const { widgetId, config } = action.payload;
      if (state.widgets[widgetId]) {
        state.widgets[widgetId] = { ...state.widgets[widgetId], ...config };
      }
    },

    /**
     * Toggle widget visibility
     */
    toggleWidgetVisibility: (state, action) => {
      const widgetId = action.payload;
      if (state.widgets[widgetId]) {
        state.widgets[widgetId].visible = !state.widgets[widgetId].visible;
      }
    },

    /**
     * Reorder widgets
     */
    reorderWidgets: (state, action) => {
      const { widgetId, newPosition } = action.payload;
      if (state.widgets[widgetId]) {
        state.widgets[widgetId].position = newPosition;
      }
    },

    /**
     * Update dashboard settings
     */
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      const { type, loading } = action.payload;
      state.loading[type] = loading;
    },

    /**
     * Set refreshing state
     */
    setRefreshing: (state, action) => {
      state.loading.refreshing = action.payload;
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
     * Set real-time enabled
     */
    setRealTimeEnabled: (state, action) => {
      state.realTimeEnabled = action.payload;
    },

    /**
     * Update last activity timestamp
     */
    updateLastActivityTimestamp: (state, action) => {
      state.lastActivityTimestamp = action.payload;
    },

    /**
     * Refresh dashboard data
     */
    refreshDashboard: (state) => {
      state.loading.refreshing = true;
      state.error = null;
    },

    /**
     * Reset dashboard state
     */
    resetDashboard: (state) => {
      return { ...initialState };
    },
  },
});

// Export actions
export const {
  setStats,
  setChartData,
  setAllChartsData,
  setRecentActivities,
  addRecentActivity,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearAllNotifications,
  setAlerts,
  addAlert,
  dismissAlert,
  removeAlert,
  updateWidget,
  toggleWidgetVisibility,
  reorderWidgets,
  updateSettings,
  setLoading,
  setRefreshing,
  setError,
  clearError,
  setRealTimeEnabled,
  updateLastActivityTimestamp,
  refreshDashboard,
  resetDashboard,
} = dashboardSlice.actions;

// Export reducer
export default dashboardSlice.reducer;

// Selectors
export const selectStats = (state) => state.dashboard.stats;
export const selectCharts = (state) => state.dashboard.charts;
export const selectChartData = (state, chartType) => state.dashboard.charts[chartType] || [];
export const selectRecentActivities = (state) => state.dashboard.recentActivities;
export const selectNotifications = (state) => state.dashboard.notifications;
export const selectAlerts = (state) => state.dashboard.alerts;
export const selectWidgets = (state) => state.dashboard.widgets;
export const selectWidget = (state, widgetId) => state.dashboard.widgets[widgetId];
export const selectSettings = (state) => state.dashboard.settings;
export const selectLoading = (state) => state.dashboard.loading;
export const selectError = (state) => state.dashboard.error;
export const selectLastUpdated = (state) => state.dashboard.lastUpdated;
export const selectRealTimeEnabled = (state) => state.dashboard.realTimeEnabled;
export const selectLastActivityTimestamp = (state) => state.dashboard.lastActivityTimestamp;

// Computed selectors
export const selectUnreadNotifications = (state) => 
  state.dashboard.notifications.filter(n => !n.read);

export const selectUnreadNotificationsCount = (state) => 
  state.dashboard.notifications.filter(n => !n.read).length;

export const selectActiveAlerts = (state) => 
  state.dashboard.alerts.filter(a => !a.dismissed);

export const selectActiveAlertsCount = (state) => 
  state.dashboard.alerts.filter(a => !a.dismissed).length;

export const selectVisibleWidgets = (state) => 
  Object.entries(state.dashboard.widgets)
    .filter(([_, config]) => config.visible)
    .sort(([_, a], [__, b]) => a.position - b.position)
    .map(([id, config]) => ({ id, ...config }));

export const selectIsLoading = (state, type) => 
  state.dashboard.loading[type] || false;

export const selectIsRefreshing = (state) => 
  state.dashboard.loading.refreshing;

export const selectDashboardState = (state) => state.dashboard;
