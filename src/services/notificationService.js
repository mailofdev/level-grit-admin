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
export const subscribeToAllTrainerMessages = async (trainerId, clients, callback) => {
  if (!trainerId || !clients || clients.length === 0) {
    return () => {};
  }

  const unsubscribes = [];

  // Subscribe to messages from each client
  clients.forEach((client) => {
    const clientId = client.clientId || client.id || client.userId;
    if (!clientId) return;

    const chatId = getChatId(trainerId, clientId);
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;

      const latestMessage = snapshot.docs[0].data();
      
      // Only trigger notification if message is from client (not from trainer)
      if (latestMessage.senderId === clientId && latestMessage.receiverId === trainerId) {
        // Check if we've already notified about this message
        const messageId = snapshot.docs[0].id;
        checkAndCreateNotification(
          trainerId,
          clientId,
          client.fullName || client.name || "Client",
          latestMessage.text,
          latestMessage.timestamp,
          messageId
        ).then((notification) => {
          if (notification) {
            callback(notification);
          }
        });
      }
    });

    unsubscribes.push(unsubscribe);
  });

  // Return cleanup function
  return () => {
    unsubscribes.forEach((unsub) => unsub());
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
  const notificationId = `${trainerId}_${clientId}_${messageId}`;
  const notificationRef = doc(db, "notifications", notificationId);

  try {
    const notificationDoc = await getDoc(notificationRef);

    // If notification doesn't exist, create it
    if (!notificationDoc.exists()) {
      await setDoc(notificationRef, {
        trainerId,
        clientId,
        clientName,
        messageText: messageText.substring(0, 100), // Preview
        fullMessage: messageText,
        timestamp,
        read: false,
        messageId,
        type: "message",
        createdAt: new Date(),
      });

      return {
        id: notificationId,
        trainerId,
        clientId,
        clientName,
        messageText: messageText.substring(0, 100),
        fullMessage: messageText,
        timestamp,
        read: false,
        messageId,
        type: "message",
        createdAt: new Date(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: new Date(),
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
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
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("trainerId", "==", trainerId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

