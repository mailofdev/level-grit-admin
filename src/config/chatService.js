// src/services/chatService.js
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// Generate unique chatId
export const getChatId = (trainerId, clientId) => {
  return trainerId < clientId
    ? `${trainerId}_${clientId}`
    : `${clientId}_${trainerId}`;
};

// Send message
export const sendMessage = async (trainerId, clientId, senderId, text) => {
  const chatId = getChatId(trainerId, clientId);
  const messagesRef = collection(db, "chats", chatId, "messages");

  await addDoc(messagesRef, {
    text,
    senderId,
    receiverId: senderId === trainerId ? clientId : trainerId,
    timestamp: serverTimestamp(),
  });
};

// Subscribe to messages (real-time updates)
export const subscribeToMessages = (trainerId, clientId, callback) => {
  const chatId = getChatId(trainerId, clientId);
  const messagesRef = collection(db, "chats", chatId, "messages");

  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(msgs);
  });
};
