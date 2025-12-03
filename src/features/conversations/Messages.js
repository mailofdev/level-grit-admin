/**
 * Messages Component
 * 
 * Enhanced conversation UI with Redux state management, unread indicators,
 * real-time updates, and proper role-based handling.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import { Form, InputGroup, Button, Card, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import Heading from "../../components/navigation/Heading";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import { getUserRole } from "../../utils/roles";
import { ROLES } from "../../utils/roles";
import Loader from "../../components/display/Loader";
import {
  sendMessageThunk,
  subscribeToConversationThunk,
  markConversationReadThunk,
} from "./conversationThunks";
import {
  setActiveConversation,
  clearActiveConversation,
  selectMessages,
  selectUnreadCount,
  selectConversationSending,
  selectConversationError,
  markConversationRead,
} from "./conversationSlice";
import { getChatId } from "../../config/chatService";
import Alert from "../../components/common/Alert";

export default function Messages({ isTrainer = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const loggedInUser = getDecryptedUser();
  const userRole = getUserRole(loggedInUser);
  
  // Get conversation participants
  const client = location.state?.client;
  const trainer = location.state?.trainer;
  
  // Get clientId from URL params (primary) or location state (fallback)
  const clientIdFromUrl = params?.clientId;
  const trainerIdFromUrl = params?.trainerId;
  
  // Determine IDs based on role
  // For trainers: trainerId = logged-in user's ID, clientId = selected client's ID
  // For clients: clientId = logged-in user's ID, trainerId = their trainer's ID
  const trainerId = isTrainer || userRole === ROLES.TRAINER
    ? (loggedInUser?.userId || loggedInUser?.id || loggedInUser?.trainerId)
    : (trainerIdFromUrl || trainer?.trainerId || trainer?.userId || trainer?.id || client?.trainerId);
    
  const clientId = isTrainer || userRole === ROLES.TRAINER
    ? (clientIdFromUrl || client?.clientId || client?.userId || client?.id)
    : (loggedInUser?.userId || loggedInUser?.id || loggedInUser?.clientId);
  
  const currentUserId = loggedInUser?.userId || loggedInUser?.id;
  const chatId = trainerId && clientId ? getChatId(trainerId, clientId) : null;
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Messages Debug:', {
      isTrainer,
      userRole,
      loggedInUser,
      clientFromState: client,
      clientIdFromUrl,
      trainerIdFromUrl,
      finalTrainerId: trainerId,
      finalClientId: clientId,
      currentUserId,
      chatId,
    });
  }
  
  // Redux state
  const messages = useSelector((state) => selectMessages(state, chatId));
  const unreadCount = useSelector((state) => selectUnreadCount(state, chatId));
  const sending = useSelector(selectConversationSending);
  const error = useSelector(selectConversationError);
  
  // Local state
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trainerInfo, setTrainerInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);
  
  // Fetch trainer info for client view
  useEffect(() => {
    // Only fetch if it's a client view and we don't have trainer info
    if ((!isTrainer && userRole !== ROLES.TRAINER) && trainerId && !trainer?.fullName && !trainer?.name) {
      const fetchTrainerInfo = async () => {
        try {
          // Try to get trainer info from API
          const axiosInstance = (await import("../../api/axiosInstance")).default;
          const response = await axiosInstance.get(`api/Client/GetTrainer/${clientId || currentUserId}`);
          if (response?.data) {
            setTrainerInfo({
              fullName: response.data.fullName || response.data.name,
              name: response.data.name || response.data.fullName,
              trainerId: response.data.trainerId || trainerId,
            });
          }
        } catch (error) {
          console.warn("Could not fetch trainer info from API, trying alternative method:", error);
          // Fallback: Try to get from user's stored data
          try {
            const { getTrainerForClient } = await import("../client/clientMessageService");
            const trainerData = await getTrainerForClient(clientId || currentUserId);
            if (trainerData) {
              setTrainerInfo({
                fullName: trainerData.fullName || trainerData.name,
                name: trainerData.name || trainerData.fullName,
                trainerId: trainerData.trainerId || trainerId,
              });
            }
          } catch (fallbackError) {
            console.warn("Could not fetch trainer info:", fallbackError);
            // Set a default name with trainerId
            setTrainerInfo({
              fullName: `Trainer ${trainerId?.substring(0, 8) || ""}`,
              name: `Trainer ${trainerId?.substring(0, 8) || ""}`,
              trainerId: trainerId,
            });
          }
        }
      };
      
      fetchTrainerInfo();
    } else if (trainer?.fullName || trainer?.name) {
      // If trainer info is already in location state, use it
      setTrainerInfo({
        fullName: trainer.fullName || trainer.name,
        name: trainer.name || trainer.fullName,
        trainerId: trainer.trainerId || trainer.userId || trainer.id || trainerId,
      });
    }
  }, [isTrainer, userRole, trainerId, clientId, currentUserId, trainer]);

  // Set active conversation
  useEffect(() => {
    if (chatId && trainerId && clientId) {
      dispatch(setActiveConversation({ trainerId, clientId, chatId }));
      
      // Mark as read when conversation becomes active
      dispatch(markConversationRead({ chatId }));
      dispatch(markConversationReadThunk({ chatId }));
    }
    
    return () => {
      dispatch(clearActiveConversation());
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [chatId, trainerId, clientId, dispatch]);
  
  // Subscribe to messages
  useEffect(() => {
    if (!trainerId || !clientId || !currentUserId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Subscribe to conversation
    dispatch(
      subscribeToConversationThunk({
        trainerId,
        clientId,
        currentUserId,
      })
    ).then((result) => {
      if (result?.payload?.unsubscribe) {
        unsubscribeRef.current = result.payload.unsubscribe;
      }
      setLoading(false);
    }).catch((err) => {
      console.error("Error subscribing to conversation:", err);
      setLoading(false);
    });
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [trainerId, clientId, currentUserId, dispatch]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Send message handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !trainerId || !clientId || sending) return;
    
    const senderId = currentUserId;
    const messageText = newMessage.trim();
    
    // Clear input immediately for better UX
    setNewMessage("");
    
    try {
      await dispatch(
        sendMessageThunk({
          trainerId,
          clientId,
          senderId,
          text: messageText,
        })
      ).unwrap();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error sending message:", err);
      }
      // Restore message on error
      setNewMessage(messageText);
    }
  }, [newMessage, trainerId, clientId, currentUserId, sending, dispatch]);
  
  // Emoji picker handler
  const onEmojiClick = useCallback((emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }, []);
  
  // Get chat name - use trainerInfo if available (for client view)
  const chatName = isTrainer || userRole === ROLES.TRAINER
    ? `Chat with ${client?.fullName || client?.name || "Client"}`
    : `Chat with ${trainerInfo?.fullName || trainerInfo?.name || trainer?.fullName || trainer?.name || "Trainer"}`;
  
  // Loading state
  if (loading && messages.length === 0) {
    return <Loader fullScreen text="Loading messages..." color="var(--color-primary)" />;
  }
  
  // Error state
  if (!trainerId || !clientId) {
    return (
      <div className="container-fluid px-2 px-md-3 py-3">
        <Heading pageName="Messages" sticky={true} />
        <div className="text-center text-muted mt-5">
          <p>Unable to load conversation. Please try again.</p>
        </div>
      </div>
    );
  }
  
  // Determine if message is from current user
  const isMessageFromCurrentUser = (message) => {
    return message.senderId === currentUserId;
  };
  
  return (
    <div className="container-fluid px-2 px-md-3 py-3">
      <Heading pageName={chatName} sticky={true} />
      
      {unreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <Badge bg="primary" className="rounded-pill px-3 py-2">
            {unreadCount} new message{unreadCount !== 1 ? "s" : ""}
          </Badge>
        </motion.div>
      )}
      
      {error && (
        <Alert
          type="error"
          message={error}
          dismissible={true}
          onClose={() => {}}
          position="inline"
          className="mb-3"
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className="border-0 shadow-lg d-flex flex-column mb-3"
          style={{
            height: "calc(100vh - 140px)",
            maxHeight: "calc(100vh - 140px)",
            borderRadius: "1rem",
            overflow: "hidden",
            background: "var(--color-bg)",
          }}
        >
          {/* Chat Messages */}
          <div
            className="flex-grow-1 overflow-auto p-2 p-md-3"
            style={{
              background: "var(--color-bg)",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {messages.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center py-5">
                <div className="mb-4" style={{ fontSize: "4rem" }}>
                  💬
                </div>
                <h5 className="fw-bold text-muted mb-2">No messages yet</h5>
                <p className="text-muted mb-0">
                  Start the conversation by sending a message below.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, idx) => {
                  const isSender = isMessageFromCurrentUser(msg);
                  return (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`d-flex mb-3 ${
                        isSender ? "justify-content-end" : "justify-content-start"
                      }`}
                    >
                      <motion.div
                        className="p-3 rounded-4 shadow-sm"
                        style={{
                          maxWidth: "70%",
                          wordBreak: "break-word",
                          background: isSender
                            ? "var(--color-primary)"
                            : "var(--color-card-bg)",
                          borderRadius: isSender
                            ? "20px 20px 0 20px"
                            : "20px 20px 20px 0",
                          border: isSender ? "none" : "1px solid rgba(0,0,0,0.1)",
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div
                          style={{
                            fontSize: "0.95rem",
                            color: isSender ? "var(--color-button-text)" : "var(--color-text-dark)",
                          }}
                        >
                          {msg.text}
                        </div>
                        <div
                          className={`${isSender ? "text-end" : "text-start"}`}
                          style={{
                            fontSize: "0.75rem",
                            marginTop: "4px",
                            color: isSender ? "rgba(255,255,255,0.8)" : "var(--color-muted)",
                          }}
                        >
                          {msg.timestamp?.toDate
                            ? msg.timestamp.toDate().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : msg.timestamp?.seconds
                            ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <motion.div
            className="bg-light p-2 p-md-3 position-relative border-top"
            style={{ background: "var(--color-card-bg)" }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="position-absolute"
                  style={{
                    bottom: "70px",
                    left: "10px",
                    zIndex: 1000,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </motion.div>
              )}
            </AnimatePresence>
            
            <Form onSubmit={handleSubmit}>
              <InputGroup className="align-items-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="light"
                    type="button"
                    className="rounded-circle me-2 border-0 shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                      width: "45px",
                      height: "45px",
                      backgroundColor: "var(--color-primary)",
                      minWidth: "45px",
                      minHeight: "45px",
                    }}
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    <FaSmile size={20} color="white" />
                  </Button>
                </motion.div>
                
                <Form.Control
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="rounded-pill border-0 shadow-sm px-4 py-2"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    fontSize: "1rem",
                    minHeight: "45px",
                  }}
                  disabled={sending}
                />
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    type="submit"
                    variant="primary"
                    className="rounded-circle ms-2 border-0 shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                      width: "45px",
                      height: "45px",
                      minWidth: "45px",
                      minHeight: "45px",
                      backgroundColor: "var(--color-primary)",
                      opacity: sending || !newMessage.trim() ? 0.6 : 1,
                    }}
                    disabled={sending || !newMessage.trim()}
                  >
                    <FaPaperPlane />
                  </Button>
                </motion.div>
              </InputGroup>
            </Form>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

