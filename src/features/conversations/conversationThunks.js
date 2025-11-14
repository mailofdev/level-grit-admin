/**
 * Conversation Thunks
 * 
 * Async actions for conversation operations including sending messages,
 * subscribing to real-time updates, and managing conversation state.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendMessage, subscribeToMessages, getChatId } from "../../config/chatService";
import { formatErrorMessage, logError } from "../../utils/errorHandler";

/**
 * Send a message in a conversation
 * @param {Object} params - Message parameters
 * @param {string} params.trainerId - Trainer ID
 * @param {string} params.clientId - Client ID
 * @param {string} params.senderId - ID of the sender (trainerId or clientId)
 * @param {string} params.text - Message text
 */
export const sendMessageThunk = createAsyncThunk(
  "conversations/sendMessage",
  async ({ trainerId, clientId, senderId, text }, { rejectWithValue, dispatch }) => {
    try {
      if (!trainerId || !clientId || !senderId || !text?.trim()) {
        return rejectWithValue("Missing required parameters for sending message");
      }

      // Optimistically add message to state (will be confirmed by real-time subscription)
      const chatId = getChatId(trainerId, clientId);
      
      await sendMessage(trainerId, clientId, senderId, text.trim());
      
      // Return success - real-time subscription will update the UI
      return { chatId, success: true };
    } catch (error) {
      logError(error, "Send Message");
      return rejectWithValue(
        formatErrorMessage(error, "Failed to send message. Please try again.")
      );
    }
  }
);

/**
 * Subscribe to messages for a conversation
 * This thunk sets up real-time listening and dispatches actions as messages arrive
 * @param {Object} params - Subscription parameters
 * @param {string} params.trainerId - Trainer ID
 * @param {string} params.clientId - Client ID
 * @param {string} params.currentUserId - ID of the current user (to determine if message is unread)
 */
export const subscribeToConversationThunk = createAsyncThunk(
  "conversations/subscribe",
  async ({ trainerId, clientId, currentUserId }, { dispatch, getState }) => {
    try {
      if (!trainerId || !clientId) {
        throw new Error("Trainer ID and Client ID are required");
      }

      const chatId = getChatId(trainerId, clientId);
      
      // Mark as subscribed
      dispatch({
        type: "conversations/setSubscriptionStatus",
        payload: { chatId, isSubscribed: true },
      });

      // Set up real-time subscription
      const unsubscribe = subscribeToMessages(trainerId, clientId, (messages) => {
        // Update messages in state
        dispatch({
          type: "conversations/setMessages",
          payload: { chatId, messages },
        });

        // Check for new unread messages
        const state = getState();
        const activeConversation = state.conversations?.activeConversation;
        const isActive = activeConversation?.chatId === chatId;

        if (!isActive && messages.length > 0) {
          // Count unread messages (messages not sent by current user)
          const unreadCount = messages.filter(
            (msg) => msg.senderId !== currentUserId
          ).length;

          if (unreadCount > 0) {
            dispatch({
              type: "conversations/setUnreadCount",
              payload: { chatId, count: unreadCount },
            });
          }
        }
      });

      // Return unsubscribe function (will be handled by component cleanup)
      return { chatId, unsubscribe };
    } catch (error) {
      logError(error, "Subscribe to Conversation");
      throw error;
    }
  }
);

/**
 * Mark a conversation as read
 * @param {Object} params - Parameters
 * @param {string} params.chatId - Chat ID
 */
export const markConversationReadThunk = createAsyncThunk(
  "conversations/markRead",
  async ({ chatId }, { dispatch }) => {
    try {
      dispatch({
        type: "conversations/markConversationRead",
        payload: { chatId },
      });
      return { chatId, success: true };
    } catch (error) {
      logError(error, "Mark Conversation Read");
      throw error;
    }
  }
);

