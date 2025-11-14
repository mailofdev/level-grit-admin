// src/contexts/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
    };
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clients, setClients] = useState([]);
  const [pushEnabled, setPushEnabled] = useState(false);

  const user = getDecryptedUser();
  const isTrainer = user?.role?.toLowerCase() === "trainer";
  const trainerId = user?.userId || user?.id || user?.trainerId;

  // Initialize push notifications
  useEffect(() => {
    if (!isTrainer) return;

    const initPushNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        setPushEnabled(true);
        await initializeServiceWorker();
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
      return;
    }

    const fetchClients = async () => {
      try {
        const clientsData = await getClientsForTrainer();
        setClients(clientsData || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
      }
    };

    fetchClients();
  }, [isTrainer, trainerId]);

  // Subscribe to notifications
  useEffect(() => {
    if (!isTrainer || !trainerId || clients.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Load existing notifications
    const loadNotifications = async () => {
      try {
        const existingNotifications = await getTrainerNotifications(trainerId);
        setNotifications(existingNotifications);
        setUnreadCount(existingNotifications.filter((n) => !n.read).length);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading notifications:", error);
        setIsLoading(false);
      }
    };

    loadNotifications();

    // Subscribe to new messages
    let unsubscribe = null;
    
    try {
      unsubscribe = subscribeToAllTrainerMessages(
        trainerId,
        clients,
        (notification) => {
          setNotifications((prev) => {
            // Check if notification already exists
            const exists = prev.some((n) => n.id === notification.id);
            if (exists) return prev;

            // Add new notification at the beginning
            const updated = [notification, ...prev];
            setUnreadCount(updated.filter((n) => !n.read).length);
            
            // Play sound for new notification
            playNotificationSound();
            
            // Show browser notification if enabled
            if (pushEnabled && "Notification" in window && Notification.permission === "granted") {
              showBrowserNotification(
                `New message from ${notification.clientName}`,
                {
                  body: notification.messageText || notification.fullMessage || "New message",
                  icon: "/192.png",
                  tag: `message-${notification.clientId}`,
                  onClick: () => {
                    window.focus();
                    // Navigate to message (handled by toast notification)
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
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [isTrainer, trainerId, clients, playNotificationSound]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await markNotificationAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    []
  );

  // Mark conversation as read
  const markConversationRead = useCallback(
    async (clientId) => {
      if (!trainerId) return;
      try {
        await markConversationAsRead(trainerId, clientId);
        setNotifications((prev) =>
          prev.map((n) =>
            n.clientId === clientId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => {
          const unreadInConversation = notifications.filter(
            (n) => n.clientId === clientId && !n.read
          ).length;
          return Math.max(0, prev - unreadInConversation);
        });
      } catch (error) {
        console.error("Error marking conversation as read:", error);
      }
    },
    [trainerId, notifications]
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!trainerId) return;
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((n) => markNotificationAsRead(n.id))
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [trainerId, notifications]);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

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
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

