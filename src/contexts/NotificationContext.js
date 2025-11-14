// src/contexts/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  subscribeToAllTrainerMessages,
  markNotificationAsRead,
  markConversationAsRead,
  getTrainerNotifications,
} from "../services/notificationService";
import {
  requestNotificationPermission,
  showBrowserNotification,
  initializeServiceWorker,
} from "../services/pushNotificationService";
import { getClientsForTrainer } from "../api/trainerAPI";
import { getDecryptedUser } from "../components/common/CommonFunctions";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    // Return default values if used outside provider (for graceful degradation)
    return {
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      soundEnabled: true,
      setSoundEnabled: () => {},
      pushEnabled: false,
      setPushEnabled: () => {},
      markAsRead: async () => {},
      markConversationRead: async () => {},
      markAllAsRead: async () => {},
      clearAll: () => {},
      isTrainer: false,
      error: null,
      refreshNotifications: async () => {},
    };
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem("notificationSoundEnabled");
    return saved !== null ? saved === "true" : true;
  });
  const [clients, setClients] = useState([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);
  const isInitializedRef = useRef(false);

  const user = getDecryptedUser();
  // More flexible role check - handle "Trainer", "trainer", or role codes
  const userRole = user?.role;
  const isTrainer = userRole && (
    userRole.toLowerCase() === "trainer" || 
    userRole === "Trainer" ||
    userRole === 1 // Role code for trainer
  );
  const trainerId = user?.userId || user?.id || user?.trainerId;

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[NotificationContext] User check:', {
        user: user ? { role: user.role, userId: user.userId, id: user.id, trainerId: user.trainerId } : null,
        isTrainer,
        trainerId,
      });
    }
  }, [user, isTrainer, trainerId]);

  // Save sound preference to localStorage
  useEffect(() => {
    localStorage.setItem("notificationSoundEnabled", soundEnabled.toString());
  }, [soundEnabled]);

  // Initialize push notifications
  useEffect(() => {
    if (!isTrainer) {
      setIsLoading(false);
      return;
    }

    const initPushNotifications = async () => {
      try {
        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
          setPushEnabled(true);
          await initializeServiceWorker();
        }
      } catch (error) {
        console.error("Error initializing push notifications:", error);
        setError("Failed to initialize push notifications");
      }
    };

    initPushNotifications();
  }, [isTrainer]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn("Could not play notification sound:", error);
    }
  }, [soundEnabled]);

  // Fetch clients for trainer
  useEffect(() => {
    if (!isTrainer || !trainerId) {
      setIsLoading(false);
      if (process.env.NODE_ENV === 'development') {
        console.log('[NotificationContext] Skipping client fetch:', { isTrainer, trainerId });
      }
      return;
    }

    const fetchClients = async () => {
      try {
        setError(null);
        if (process.env.NODE_ENV === 'development') {
          console.log('[NotificationContext] Fetching clients for trainer:', trainerId);
        }
        const clientsData = await getClientsForTrainer();
        const clientsList = clientsData || [];
        setClients(clientsList);
        if (process.env.NODE_ENV === 'development') {
          console.log('[NotificationContext] Clients fetched:', clientsList.length);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setError("Failed to load clients");
        setClients([]);
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [isTrainer, trainerId]);

  // Load existing notifications
  const loadNotifications = useCallback(async () => {
    if (!isTrainer || !trainerId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      const existingNotifications = await getTrainerNotifications(trainerId);
      setNotifications(existingNotifications);
      setUnreadCount(existingNotifications.filter((n) => !n.read).length);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setError("Failed to load notifications");
      setIsLoading(false);
    }
  }, [isTrainer, trainerId]);

  // Subscribe to notifications
  useEffect(() => {
    if (!isTrainer || !trainerId) {
      setIsLoading(false);
      if (process.env.NODE_ENV === 'development') {
        console.log('[NotificationContext] Not a trainer or no trainerId, skipping subscription');
      }
      return;
    }

    // Always load existing notifications first, even without clients
    if (!isInitializedRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[NotificationContext] Loading existing notifications for trainer:', trainerId);
      }
      loadNotifications();
      isInitializedRef.current = true;
    }

    // Only subscribe to new messages if we have clients
    if (clients.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[NotificationContext] No clients yet, will subscribe when clients are loaded');
      }
      return;
    }

    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Subscribe to new messages
    try {
      setError(null);
      if (process.env.NODE_ENV === 'development') {
        console.log('[NotificationContext] Setting up subscriptions for', clients.length, 'clients');
      }
      unsubscribeRef.current = subscribeToAllTrainerMessages(
        trainerId,
        clients,
        (notification) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[NotificationContext] New notification received:', notification);
          }
          setNotifications((prev) => {
            // Check if notification already exists
            const exists = prev.some((n) => n.id === notification.id);
            if (exists) return prev;

            // Add new notification at the beginning
            const updated = [notification, ...prev];
            const newUnreadCount = updated.filter((n) => !n.read).length;
            setUnreadCount(newUnreadCount);
            
            // Play sound for new notification
            playNotificationSound();
            
            // Show browser notification if enabled
            if (pushEnabled && "Notification" in window && Notification.permission === "granted") {
              showBrowserNotification(
                `New message from ${notification.clientName || "Client"}`,
                {
                  body: notification.messageText || notification.fullMessage || "New message",
                  icon: "/192.png",
                  tag: `message-${notification.clientId}`,
                  onClick: () => {
                    window.focus();
                  },
                }
              );
            }
            
            return updated;
          });
        }
      );
    } catch (error) {
      console.error("Error setting up message subscriptions:", error);
      setError("Failed to subscribe to notifications");
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [isTrainer, trainerId, clients, playNotificationSound, pushEnabled, loadNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        setError(null);
        const notification = notifications.find((n) => n.id === notificationId);
        if (!notification) return;

        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Update in backend
        await markNotificationAsRead(notificationId);
      } catch (error) {
        console.error("Error marking notification as read:", error);
        setError("Failed to mark notification as read");
        // Revert optimistic update
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n))
        );
        setUnreadCount((prev) => prev + 1);
      }
    },
    [notifications]
  );

  // Mark conversation as read
  const markConversationRead = useCallback(
    async (clientId) => {
      if (!trainerId) return;
      try {
        setError(null);
        const unreadInConversation = notifications.filter(
          (n) => n.clientId === clientId && !n.read
        ).length;

        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) =>
            n.clientId === clientId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - unreadInConversation));

        // Update in backend
        await markConversationAsRead(trainerId, clientId);
      } catch (error) {
        console.error("Error marking conversation as read:", error);
        setError("Failed to mark conversation as read");
        // Revert optimistic update
        loadNotifications();
      }
    },
    [trainerId, notifications, loadNotifications]
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!trainerId) return;
    try {
      setError(null);
      const unreadNotifications = notifications.filter((n) => !n.read);
      
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      const previousUnreadCount = unreadCount;
      setUnreadCount(0);

      // Update in backend
      await Promise.all(
        unreadNotifications.map((n) => markNotificationAsRead(n.id))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
      setError("Failed to mark all as read");
      // Revert optimistic update
      loadNotifications();
    }
  }, [trainerId, notifications, unreadCount, loadNotifications]);

  // Clear all notifications (local only, doesn't delete from backend)
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Refresh notifications manually
  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    soundEnabled,
    setSoundEnabled,
    pushEnabled,
    setPushEnabled,
    markAsRead,
    markConversationRead,
    markAllAsRead,
    clearAll,
    isTrainer,
    error,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

