import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import { Form, InputGroup, Button, Card } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import Heading from "../../components/navigation/Heading";
import { useLocation } from "react-router-dom";
import { sendMessage, subscribeToMessages } from "../../config/chatService";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import Loader from "../../components/display/Loader";

export default function Messages({ isTrainer = false }) {
  const location = useLocation();
  const client = location.state?.client;
  const trainer = location.state?.trainer;
  const loggedInUser = getDecryptedUser();

  const trainerId = isTrainer 
    ? (loggedInUser?.userId || loggedInUser?.id || loggedInUser?.trainerId)
    : (trainer?.trainerId || trainer?.userId || trainer?.id);
  const clientId = isTrainer 
    ? (client?.clientId || client?.userId || client?.id)
    : (loggedInUser?.userId || loggedInUser?.clientId || loggedInUser?.id);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    if (!trainerId || !clientId) {
      console.log("Missing IDs for messages:", { trainerId, clientId, isTrainer, client, trainer, loggedInUser });
      if (trainerId && clientId) {
        setLoading(false);
      }
      return;
    }
    
    console.log("Subscribing to messages (trainer view):", { trainerId, clientId });
    const unsubscribe = subscribeToMessages(trainerId, clientId, (msgs) => {
      console.log("Received messages (trainer view):", msgs);
      setMessages(msgs);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [trainerId, clientId, isTrainer]);

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !trainerId || !clientId) return;
    const senderId = isTrainer ? trainerId : clientId;
    console.log("Sending message (trainer view):", { trainerId, clientId, senderId, message: newMessage.trim() });
    try {
      await sendMessage(trainerId, clientId, senderId, newMessage.trim());
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const chatName = isTrainer
    ? `Chat with ${client?.fullName || "Client"}`
    : `Chat with ${trainer?.fullName || "Trainer"}`;

  // Loader
  if (loading) {
    return <Loader fullScreen text="Fetching Messages..." color="var(--color-primary)" />;
  }

  if ((!client && isTrainer) || (!trainer && !isTrainer)) {
    return (
      <p className="text-muted mt-4 text-center">
        Select {isTrainer ? "a client" : "a trainer"} to view messages.
      </p>
    );
  }

  return (
    <div className="container-fluid px-2 px-md-3 py-2">
      <Heading pageName={chatName} sticky={true} />

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
            background: "var(--color-bg)"
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
            <div className="text-center text-muted mt-5">
              <p>No messages yet. Start the conversation! 💬</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, idx) => {
                const isSender = msg.senderId === (isTrainer ? trainerId : clientId);
                return (
                  <motion.div
                    key={msg.id}
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
                        backgroundColor: isSender 
                          ? "var(--color-primary)" 
                          : "var(--color-card-bg)",
                        background: isSender 
                          ? "var(--color-primary)" 
                          : "var(--color-card-bg)",
                        borderRadius: isSender
                          ? "20px 20px 0 20px"
                          : "20px 20px 20px 0",
                        border: isSender ? "none" : "1px solid rgba(0,0,0,0.1)"
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div style={{ fontSize: "0.95rem", color: isSender ? "var(--color-button-text)" : "var(--color-text-dark)" }}>{msg.text}</div>
                      <div
                        className={`text-muted ${isSender ? "text-end" : "text-start"}`}
                        style={{ fontSize: "0.75rem", marginTop: "4px" }}
                      >
                        {msg.timestamp?.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
          className="bg-light p-3 position-relative border-top"
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
                  overflow: "hidden"
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
                  className="rounded-circle me-2 border-0 shadow-sm d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    backgroundColor: "var(--color-primary)",
                    minWidth: "45px",
                    minHeight: "45px"
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
                  minHeight: "45px"
                }}
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
                    backgroundColor: "#007AFF"
                  }}
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
