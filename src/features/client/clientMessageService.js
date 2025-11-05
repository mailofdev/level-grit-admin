// src/features/client/clientMessageService.js
// Service for client messaging functionality

import axiosInstance from "../../api/axiosInstance";
import { sendMessage, subscribeToMessages, getChatId } from "../../config/chatService";

/**
 * Get trainer information for the logged-in client
 * @param {string} clientId - The client's ID
 * @returns {Promise<Object>} Trainer information
 */
export const getTrainerForClient = async (clientId) => {
  try {
    // TODO: Replace with actual API endpoint when available
    // const { data } = await axiosInstance.get(`api/Client/GetTrainer/${clientId}`);
    // return data;
    
    // Mock data for testing
    return {
      trainerId: "trainer-001",
      fullName: "John Trainer",
      email: "trainer@example.com",
      phoneNumber: "1234567890",
      profileImage: null,
    };
  } catch (error) {
    console.error("Error fetching trainer:", error);
    throw error;
  }
};

/**
 * Send a message from client to trainer
 * @param {string} trainerId - The trainer's ID
 * @param {string} clientId - The client's ID
 * @param {string} message - The message text
 * @returns {Promise<void>}
 */
export const sendMessageToTrainer = async (trainerId, clientId, message) => {
  try {
    await sendMessage(trainerId, clientId, clientId, message);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Subscribe to messages between client and trainer
 * @param {string} trainerId - The trainer's ID
 * @param {string} clientId - The client's ID
 * @param {Function} callback - Callback function to receive messages
 * @returns {Function} Unsubscribe function
 */
export const subscribeToTrainerMessages = (trainerId, clientId, callback) => {
  try {
    return subscribeToMessages(trainerId, clientId, callback);
  } catch (error) {
    console.error("Error subscribing to messages:", error);
    throw error;
  }
};

/**
 * Get chat ID for client-trainer conversation
 * @param {string} trainerId - The trainer's ID
 * @param {string} clientId - The client's ID
 * @returns {string} Chat ID
 */
export const getClientTrainerChatId = (trainerId, clientId) => {
  return getChatId(trainerId, clientId);
};

/**
 * Mark messages as read
 * @param {string} trainerId - The trainer's ID
 * @param {string} clientId - The client's ID
 * @param {Array<string>} messageIds - Array of message IDs to mark as read
 * @returns {Promise<void>}
 */
export const markMessagesAsRead = async (trainerId, clientId, messageIds) => {
  try {
    // TODO: Replace with actual API endpoint when available
    // await axiosInstance.post(`api/Client/MarkMessagesAsRead`, {
    //   trainerId,
    //   clientId,
    //   messageIds
    // });
    
    console.log("Marking messages as read:", { trainerId, clientId, messageIds });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

/**
 * Get unread message count for client
 * @param {string} clientId - The client's ID
 * @returns {Promise<number>} Unread message count
 */
export const getUnreadMessageCount = async (clientId) => {
  try {
    // TODO: Replace with actual API endpoint when available
    // const { data } = await axiosInstance.get(`api/Client/GetUnreadMessageCount/${clientId}`);
    // return data.count;
    
    // Mock data for testing
    return 0;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
};

