// src/services/notificationService.js
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getChatId } from "../config/chatService";

/**
 * Subscribe to all new messages for a trainer from any client
 * @param {string} trainerId - The trainer's ID
 * @param {Function} callback - Callback function that receives notifications
 * @returns {Function} Unsubscribe function
 */
export const subscribeToTrainerNotifications = (trainerId, callback) => {
  if (!trainerId) {
    console.warn("Trainer ID is required for notifications");
    return () => {};
  }

  // Get all chats where trainer is involved
  // We'll listen to all chat collections and filter messages where receiverId === trainerId
  const notificationsRef = collection(db, "notifications");
  const q = query(
    notificationsRef,
    where("receiverId", "==", trainerId),
    where("read", "==", false),
    orderBy("timestamp", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(notifications);
  });
};

/**
 * Listen to all chats for a trainer and detect new messages
 * This is a more comprehensive approach that listens to all message collections
 */
export const subscribeToAllTrainerMessages = (trainerId, clients, callback) => {
  if (!trainerId || !clients || clients.length === 0) {
    console.warn("subscribeToAllTrainerMessages: Missing trainerId or clients");
    return () => {};
  }

  const unsubscribes = [];
  const activeSubscriptions = new Set();

  // Subscribe to messages from each client
  clients.forEach((client) => {
    try {
      const clientId = client.clientId || client.id || client.userId;
      if (!clientId) {
        console.warn("subscribeToAllTrainerMessages: Invalid client data", client);
        return;
      }

      const chatId = getChatId(trainerId, clientId);
      if (!chatId) {
        console.warn("subscribeToAllTrainerMessages: Failed to generate chatId", { trainerId, clientId });
        return;
      }

      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          try {
            if (snapshot.empty) return;

            const latestMessage = snapshot.docs[0].data();
            
            // Validate message data
            if (!latestMessage || !latestMessage.senderId || !latestMessage.receiverId) {
              console.warn("subscribeToAllTrainerMessages: Invalid message data", latestMessage);
              return;
            }
            
            // Only trigger notification if message is from client (not from trainer)
            if (latestMessage.senderId === clientId && latestMessage.receiverId === trainerId) {
              const messageId = snapshot.docs[0].id;
              if (!messageId) {
                console.warn("subscribeToAllTrainerMessages: Missing messageId");
                return;
              }

              checkAndCreateNotification(
                trainerId,
                clientId,
                client.fullName || client.name || "Client",
                latestMessage.text || "",
                latestMessage.timestamp,
                messageId
              )
                .then((notification) => {
                  if (notification) {
                    callback(notification);
                  }
                })
                .catch((error) => {
                  console.error("Error creating notification:", error);
                  // Don't throw, just log the error
                });
            }
          } catch (error) {
            console.error("Error processing message snapshot:", error);
          }
        },
        (error) => {
          console.error("Error in message snapshot:", error);
          // Remove from active subscriptions on error
          activeSubscriptions.delete(clientId);
        }
      );

      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribes.push(unsubscribe);
        activeSubscriptions.add(clientId);
      }
    } catch (error) {
      console.error("Error setting up subscription for client:", error, client);
    }
  });

  // Return cleanup function
  return () => {
    unsubscribes.forEach((unsub) => {
      try {
        if (unsub && typeof unsub === 'function') {
          unsub();
        }
      } catch (error) {
        console.error("Error unsubscribing:", error);
      }
    });
    activeSubscriptions.clear();
  };
};

/**
 * Check if notification exists, if not create it
 */
const checkAndCreateNotification = async (
  trainerId,
  clientId,
  clientName,
  messageText,
  timestamp,
  messageId
) => {
  // Validate inputs
  if (!trainerId || !clientId || !messageId) {
    console.warn("checkAndCreateNotification: Missing required parameters", {
      trainerId,
      clientId,
      messageId,
    });
    return null;
  }

  const notificationId = `${trainerId}_${clientId}_${messageId}`;
  const notificationRef = doc(db, "notifications", notificationId);

  try {
    const notificationDoc = await getDoc(notificationRef);

    // If notification doesn't exist, create it
    if (!notificationDoc.exists()) {
      const safeMessageText = messageText || "";
      const safeClientName = clientName || "Client";
      const safeTimestamp = timestamp || new Date();

      await setDoc(notificationRef, {
        trainerId,
        clientId,
        clientName: safeClientName,
        messageText: safeMessageText.substring(0, 100), // Preview
        fullMessage: safeMessageText,
        timestamp: safeTimestamp,
        read: false,
        messageId,
        type: "message",
        createdAt: new Date(),
      });

      return {
        id: notificationId,
        trainerId,
        clientId,
        clientName: safeClientName,
        messageText: safeMessageText.substring(0, 100),
        fullMessage: safeMessageText,
        timestamp: safeTimestamp,
        read: false,
        messageId,
        type: "message",
        createdAt: new Date(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error creating notification:", error);
    // Return null instead of throwing to prevent breaking the subscription
    return null;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) {
    console.warn("markNotificationAsRead: Missing notificationId");
    throw new Error("Notification ID is required");
  }

  try {
    const notificationRef = doc(db, "notifications", notificationId);
    const notificationDoc = await getDoc(notificationRef);
    
    if (!notificationDoc.exists()) {
      console.warn("markNotificationAsRead: Notification not found", notificationId);
      return;
    }

    await updateDoc(notificationRef, {
      read: true,
      readAt: new Date(),
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error; // Re-throw to allow caller to handle
  }
};

/**
 * Mark all notifications for a trainer-client conversation as read
 */
export const markConversationAsRead = async (trainerId, clientId) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("trainerId", "==", trainerId),
      where("clientId", "==", clientId),
      where("read", "==", false)
    );

    const snapshot = await getDocs(q);
    const updatePromises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        read: true,
        readAt: new Date(),
      })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking conversation as read:", error);
  }
};

/**
 * Get unread notification count for a trainer
 */
export const getUnreadNotificationCount = async (trainerId) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("trainerId", "==", trainerId),
      where("read", "==", false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
};

/**
 * Get all notifications for a trainer
 */
export const getTrainerNotifications = async (trainerId, limitCount = 50) => {
  if (!trainerId) {
    console.warn("getTrainerNotifications: Missing trainerId");
    return [];
  }

  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("trainerId", "==", trainerId),
      orderBy("timestamp", "desc"),
      limit(Math.min(limitCount, 100)) // Cap at 100 for safety
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting notifications:", error);
    // Return empty array instead of throwing to prevent breaking the UI
    return [];
  }
};

