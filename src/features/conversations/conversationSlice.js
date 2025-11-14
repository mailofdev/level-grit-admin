/**
 * Conversation Slice
 * 
 * Centralized state management for all conversations between Trainers and Clients.
 * Handles message state, unread counts, active conversations, and real-time updates.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Active conversation
  activeConversation: null, // { trainerId, clientId, chatId }
  
  // Messages by chatId
  messages: {}, // { [chatId]: Message[] }
  
  // Unread counts by chatId
  unreadCounts: {}, // { [chatId]: number }
  
  // Conversation metadata
  conversations: [], // List of all conversations with metadata
  
  // Loading states
  loading: false,
  sending: false,
  error: null,
  
  // Real-time subscription status
  subscriptions: {}, // { [chatId]: boolean }
  
  // Last message timestamps for sorting
  lastMessageTimestamps: {}, // { [chatId]: timestamp }
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    /**
     * Set the active conversation
     */
    setActiveConversation: (state, action) => {
      const { trainerId, clientId, chatId } = action.payload;
      state.activeConversation = { trainerId, clientId, chatId };
      
      // Mark messages as read when conversation becomes active
      if (chatId && state.unreadCounts[chatId]) {
        state.unreadCounts[chatId] = 0;
      }
    },
    
    /**
     * Clear active conversation
     */
    clearActiveConversation: (state) => {
      state.activeConversation = null;
    },
    
    /**
     * Set messages for a specific chat
     */
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
      
      // Update last message timestamp
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const timestamp = lastMessage.timestamp?.toDate?.() || 
                         lastMessage.timestamp?.seconds * 1000 || 
                         Date.now();
        state.lastMessageTimestamps[chatId] = timestamp;
      }
    },
    
    /**
     * Add a new message to a chat
     */
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      
      // Avoid duplicates
      const exists = state.messages[chatId].some(m => m.id === message.id);
      if (!exists) {
        state.messages[chatId].push(message);
        
        // Update last message timestamp
        const timestamp = message.timestamp?.toDate?.() || 
                         message.timestamp?.seconds * 1000 || 
                         Date.now();
        state.lastMessageTimestamps[chatId] = timestamp;
      }
    },
    
    /**
     * Update unread count for a chat
     */
    setUnreadCount: (state, action) => {
      const { chatId, count } = action.payload;
      state.unreadCounts[chatId] = count;
    },
    
    /**
     * Increment unread count (when receiving a new message)
     */
    incrementUnreadCount: (state, action) => {
      const { chatId } = action.payload;
      if (!state.unreadCounts[chatId]) {
        state.unreadCounts[chatId] = 0;
      }
      
      // Only increment if this conversation is not active
      if (!state.activeConversation || state.activeConversation.chatId !== chatId) {
        state.unreadCounts[chatId] += 1;
      }
    },
    
    /**
     * Mark conversation as read
     */
    markConversationRead: (state, action) => {
      const { chatId } = action.payload;
      state.unreadCounts[chatId] = 0;
    },
    
    /**
     * Set subscription status for a chat
     */
    setSubscriptionStatus: (state, action) => {
      const { chatId, isSubscribed } = action.payload;
      state.subscriptions[chatId] = isSubscribed;
    },
    
    /**
     * Set conversations list
     */
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    
    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    /**
     * Set sending state
     */
    setSending: (state, action) => {
      state.sending = action.payload;
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
     * Reset conversation state
     */
    resetConversations: (state) => {
      return initialState;
    },
  },
});

export const {
  setActiveConversation,
  clearActiveConversation,
  setMessages,
  addMessage,
  setUnreadCount,
  incrementUnreadCount,
  markConversationRead,
  setSubscriptionStatus,
  setConversations,
  setLoading,
  setSending,
  setError,
  clearError,
  resetConversations,
} = conversationSlice.actions;

// Selectors
export const selectActiveConversation = (state) => state.conversations.activeConversation;
export const selectMessages = (state, chatId) => state.conversations.messages[chatId] || [];
export const selectUnreadCount = (state, chatId) => state.conversations.unreadCounts[chatId] || 0;
export const selectTotalUnreadCount = (state) => 
  Object.values(state.conversations.unreadCounts).reduce((sum, count) => sum + count, 0);
export const selectConversations = (state) => state.conversations.conversations;
export const selectConversationLoading = (state) => state.conversations.loading;
export const selectConversationSending = (state) => state.conversations.sending;
export const selectConversationError = (state) => state.conversations.error;

export default conversationSlice.reducer;

