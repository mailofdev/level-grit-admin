/**
 * Messaging slice for Redux store
 * Manages real-time messaging, chat history, and communication features
 */
import { createSlice } from '@reduxjs/toolkit';

// Initial messaging state
const initialState = {
  // Chat rooms and conversations
  conversations: [],
  activeConversation: null,
  
  // Messages
  messages: {}, // conversationId -> messages array
  unreadCounts: {}, // conversationId -> unread count
  
  // Real-time connection
  isConnected: false,
  connectionStatus: 'disconnected', // disconnected, connecting, connected, error
  
  // UI states
  isTyping: {}, // conversationId -> typing users
  lastSeen: {}, // userId -> last seen timestamp
  
  // Message states
  sendingMessages: {}, // messageId -> sending state
  failedMessages: {}, // messageId -> error info
  
  // Search and filters
  searchQuery: '',
  searchResults: [],
  messageFilters: {
    dateRange: null,
    sender: null,
    messageType: 'all', // all, text, image, file, etc.
  },
  
  // Loading states
  loading: {
    conversations: false,
    messages: false,
    sending: false,
    searching: false,
  },
  
  // Error states
  error: null,
  connectionError: null,
  
  // Settings
  settings: {
    notifications: true,
    soundEnabled: true,
    autoMarkRead: true,
    showTyping: true,
    showLastSeen: true,
    messageHistory: 1000, // number of messages to keep
  },
  
  // Draft messages
  drafts: {}, // conversationId -> draft message
  
  // File uploads
  uploads: {}, // uploadId -> upload progress
  attachments: {}, // messageId -> attachments
  
  // Emoji and reactions
  reactions: {}, // messageId -> reactions
  emojiPicker: {
    isOpen: false,
    targetMessage: null,
  },
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    /**
     * Set connection status
     */
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
      state.isConnected = action.payload === 'connected';
    },

    /**
     * Set connection error
     */
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
    },

    /**
     * Clear connection error
     */
    clearConnectionError: (state) => {
      state.connectionError = null;
    },

    /**
     * Set conversations
     */
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },

    /**
     * Add or update conversation
     */
    upsertConversation: (state, action) => {
      const conversation = action.payload;
      const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex >= 0) {
        state.conversations[existingIndex] = { ...state.conversations[existingIndex], ...conversation };
      } else {
        state.conversations.unshift(conversation);
      }
    },

    /**
     * Remove conversation
     */
    removeConversation: (state, action) => {
      const conversationId = action.payload;
      state.conversations = state.conversations.filter(c => c.id !== conversationId);
      
      // Clean up related data
      delete state.messages[conversationId];
      delete state.unreadCounts[conversationId];
      delete state.drafts[conversationId];
      delete state.isTyping[conversationId];
    },

    /**
     * Set active conversation
     */
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },

    /**
     * Set messages for a conversation
     */
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },

    /**
     * Add message to conversation
     */
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      
      state.messages[conversationId].push(message);
      
      // Update conversation last message
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = message.timestamp;
      }
    },

    /**
     * Update message
     */
    updateMessage: (state, action) => {
      const { conversationId, messageId, updates } = action.payload;
      
      if (state.messages[conversationId]) {
        const messageIndex = state.messages[conversationId].findIndex(m => m.id === messageId);
        if (messageIndex >= 0) {
          state.messages[conversationId][messageIndex] = {
            ...state.messages[conversationId][messageIndex],
            ...updates,
          };
        }
      }
    },

    /**
     * Remove message
     */
    removeMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;
      
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].filter(
          m => m.id !== messageId
        );
      }
    },

    /**
     * Mark messages as read
     */
    markMessagesAsRead: (state, action) => {
      const { conversationId, messageIds } = action.payload;
      
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].map(message => {
          if (messageIds.includes(message.id)) {
            return { ...message, read: true, readAt: new Date().toISOString() };
          }
          return message;
        });
      }
      
      // Reset unread count
      state.unreadCounts[conversationId] = 0;
    },

    /**
     * Set unread count for conversation
     */
    setUnreadCount: (state, action) => {
      const { conversationId, count } = action.payload;
      state.unreadCounts[conversationId] = count;
    },

    /**
     * Increment unread count
     */
    incrementUnreadCount: (state, action) => {
      const conversationId = action.payload;
      state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
    },

    /**
     * Set typing status
     */
    setTyping: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      
      if (!state.isTyping[conversationId]) {
        state.isTyping[conversationId] = {};
      }
      
      if (isTyping) {
        state.isTyping[conversationId][userId] = new Date().toISOString();
      } else {
        delete state.isTyping[conversationId][userId];
      }
    },

    /**
     * Set last seen for user
     */
    setLastSeen: (state, action) => {
      const { userId, timestamp } = action.payload;
      state.lastSeen[userId] = timestamp;
    },

    /**
     * Set message sending state
     */
    setMessageSending: (state, action) => {
      const { messageId, sending } = action.payload;
      state.sendingMessages[messageId] = sending;
    },

    /**
     * Set failed message
     */
    setFailedMessage: (state, action) => {
      const { messageId, error } = action.payload;
      state.failedMessages[messageId] = error;
    },

    /**
     * Clear failed message
     */
    clearFailedMessage: (state, action) => {
      const messageId = action.payload;
      delete state.failedMessages[messageId];
    },

    /**
     * Set search query
     */
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    /**
     * Set search results
     */
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },

    /**
     * Set message filters
     */
    setMessageFilters: (state, action) => {
      state.messageFilters = { ...state.messageFilters, ...action.payload };
    },

    /**
     * Clear search
     */
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },

    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      const { type, loading } = action.payload;
      state.loading[type] = loading;
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
     * Update settings
     */
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    /**
     * Set draft message
     */
    setDraft: (state, action) => {
      const { conversationId, draft } = action.payload;
      state.drafts[conversationId] = draft;
    },

    /**
     * Clear draft
     */
    clearDraft: (state, action) => {
      const conversationId = action.payload;
      delete state.drafts[conversationId];
    },

    /**
     * Set upload progress
     */
    setUploadProgress: (state, action) => {
      const { uploadId, progress } = action.payload;
      state.uploads[uploadId] = progress;
    },

    /**
     * Remove upload
     */
    removeUpload: (state, action) => {
      const uploadId = action.payload;
      delete state.uploads[uploadId];
    },

    /**
     * Set attachments for message
     */
    setAttachments: (state, action) => {
      const { messageId, attachments } = action.payload;
      state.attachments[messageId] = attachments;
    },

    /**
     * Add reaction to message
     */
    addReaction: (state, action) => {
      const { messageId, reaction } = action.payload;
      
      if (!state.reactions[messageId]) {
        state.reactions[messageId] = [];
      }
      
      state.reactions[messageId].push(reaction);
    },

    /**
     * Remove reaction from message
     */
    removeReaction: (state, action) => {
      const { messageId, reactionId } = action.payload;
      
      if (state.reactions[messageId]) {
        state.reactions[messageId] = state.reactions[messageId].filter(
          r => r.id !== reactionId
        );
      }
    },

    /**
     * Toggle emoji picker
     */
    toggleEmojiPicker: (state, action) => {
      const { isOpen, targetMessage } = action.payload;
      state.emojiPicker = { isOpen, targetMessage };
    },

    /**
     * Reset messaging state
     */
    resetMessagingState: (state) => {
      return { ...initialState };
    },
  },
});

// Export actions
export const {
  setConnectionStatus,
  setConnectionError,
  clearConnectionError,
  setConversations,
  upsertConversation,
  removeConversation,
  setActiveConversation,
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  markMessagesAsRead,
  setUnreadCount,
  incrementUnreadCount,
  setTyping,
  setLastSeen,
  setMessageSending,
  setFailedMessage,
  clearFailedMessage,
  setSearchQuery,
  setSearchResults,
  setMessageFilters,
  clearSearch,
  setLoading,
  setError,
  clearError,
  updateSettings,
  setDraft,
  clearDraft,
  setUploadProgress,
  removeUpload,
  setAttachments,
  addReaction,
  removeReaction,
  toggleEmojiPicker,
  resetMessagingState,
} = messagingSlice.actions;

// Export reducer
export default messagingSlice.reducer;

// Selectors
export const selectConversations = (state) => state.messaging.conversations;
export const selectActiveConversation = (state) => state.messaging.activeConversation;
export const selectMessages = (state, conversationId) => state.messaging.messages[conversationId] || [];
export const selectUnreadCount = (state, conversationId) => state.messaging.unreadCounts[conversationId] || 0;
export const selectTotalUnreadCount = (state) => Object.values(state.messaging.unreadCounts).reduce((sum, count) => sum + count, 0);

export const selectIsConnected = (state) => state.messaging.isConnected;
export const selectConnectionStatus = (state) => state.messaging.connectionStatus;
export const selectConnectionError = (state) => state.messaging.connectionError;

export const selectIsTyping = (state, conversationId) => state.messaging.isTyping[conversationId] || {};
export const selectLastSeen = (state, userId) => state.messaging.lastSeen[userId];

export const selectSendingMessages = (state) => state.messaging.sendingMessages;
export const selectFailedMessages = (state) => state.messaging.failedMessages;

export const selectSearchQuery = (state) => state.messaging.searchQuery;
export const selectSearchResults = (state) => state.messaging.searchResults;
export const selectMessageFilters = (state) => state.messaging.messageFilters;

export const selectLoading = (state) => state.messaging.loading;
export const selectError = (state) => state.messaging.error;

export const selectSettings = (state) => state.messaging.settings;
export const selectDraft = (state, conversationId) => state.messaging.drafts[conversationId];
export const selectUploads = (state) => state.messaging.uploads;
export const selectAttachments = (state, messageId) => state.messaging.attachments[messageId] || [];
export const selectReactions = (state, messageId) => state.messaging.reactions[messageId] || [];
export const selectEmojiPicker = (state) => state.messaging.emojiPicker;

// Computed selectors
export const selectConversationById = (state, conversationId) => 
  state.messaging.conversations.find(c => c.id === conversationId);

export const selectMessagesByConversation = (state, conversationId) => 
  state.messaging.messages[conversationId] || [];

export const selectLastMessage = (state, conversationId) => {
  const messages = state.messaging.messages[conversationId] || [];
  return messages[messages.length - 1] || null;
};

export const selectTypingUsers = (state, conversationId) => {
  const typing = state.messaging.isTyping[conversationId] || {};
  return Object.keys(typing);
};

export const selectIsMessageSending = (state, messageId) => 
  state.messaging.sendingMessages[messageId] || false;

export const selectIsMessageFailed = (state, messageId) => 
  !!state.messaging.failedMessages[messageId];
