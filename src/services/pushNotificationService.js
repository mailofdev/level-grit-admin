// src/services/pushNotificationService.js
// Web Push API service for background notifications

/**
 * Request notification permission from the user
 */
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    console.warn("Notification permission denied");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

/**
 * Show a browser notification
 */
export const showBrowserNotification = (title, options = {}) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return null;
  }

  const notification = new Notification(title, {
    icon: options.icon || "/192.png",
    badge: "/192.png",
    body: options.body || "",
    tag: options.tag || "message",
    requireInteraction: options.requireInteraction || false,
    silent: options.silent || false,
    ...options,
  });

  notification.onclick = () => {
    window.focus();
    if (options.onClick) {
      options.onClick();
    }
    notification.close();
  };

  // Auto close after 5 seconds
  setTimeout(() => {
    notification.close();
  }, options.duration || 5000);

  return notification;
};

/**
 * Initialize service worker for push notifications
 */
export const initializeServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers are not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js");
    console.log("Service Worker registered:", registration);
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
};

/**
 * Subscribe to push notifications
 */
export const subscribeToPushNotifications = async (trainerId) => {
  try {
    const registration = await initializeServiceWorker();
    if (!registration) return null;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.REACT_APP_VAPID_PUBLIC_KEY || ""
      ),
    });

    // Send subscription to server
    // You would typically send this to your backend
    console.log("Push subscription:", subscription);

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return null;
  }
};

/**
 * Convert VAPID key from base64 URL to Uint8Array
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

