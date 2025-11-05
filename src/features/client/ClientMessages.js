import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import { Form, InputGroup, Button, Card } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import Heading from "../../components/navigation/Heading";
import { getDecryptedUser } from "../../components/common/CommonFunctions";
import {
  getTrainerForClient,
  sendMessageToTrainer,
  subscribeToTrainerMessages,
} from "./clientMessageService";
import Loader from "../../components/display/Loader";

const ClientMessages = () => {
  const user = getDecryptedUser();
  const clientId = user?.userId || user?.clientId;
  
  const [trainer, setTrainer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch trainer information
  useEffect(() => {
    const fetchTrainer = async () => {
      if (!clientId) {
        setError("Client ID not found");
        setLoading(false);
        return;
      }

      try {
        const trainerData = await getTrainerForClient(clientId);
        setTrainer(trainerData);
      } catch (err) {
        console.error("Error fetching trainer:", err);
        setError("Failed to load trainer information");
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [clientId]);

  // Subscribe to messages
  useEffect(() => {
    if (!trainer?.trainerId || !clientId) return;

    const unsubscribe = subscribeToTrainerMessages(
      trainer.trainerId,
      clientId,
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [trainer?.trainerId, clientId]);

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !trainer?.trainerId) return;

    try {
      await sendMessageToTrainer(
        trainer.trainerId,
        clientId,
        newMessage.trim()
      );
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const chatName = trainer
    ? `Chat with ${trainer.fullName || "Trainer"}`
    : "Messages";

  // Loading state
  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading messages..."
        color="var(--color-primary)"
      />
    );
  }

  // Error state
  if (error && !trainer) {
    return (
      <div className="container py-3">
        <Heading pageName="Messages" sticky={true} />
        <Card className="border-0 shadow-lg mt-4">
          <Card.Body className="text-center py-5">
            <p className="text-danger mb-0">{error}</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="container py-3">
        <Heading pageName="Messages" sticky={true} />
        <Card className="border-0 shadow-lg mt-4">
          <Card.Body className="text-center py-5">
            <p className="text-muted mb-0">
              No trainer assigned. Please contact support.
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <Heading pageName={chatName} sticky={true} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className="border-0 shadow-lg d-flex flex-column mb-5"
          style={{
            height: "calc(100vh - 160px)",
            borderRadius: "16px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          {/* Chat Header */}
          <div
            className="p-3 border-bottom"
            style={{
              background: "linear-gradient(135deg, #007AFF 0%, #0056b3 100%)",
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "50px",
                  height: "50px",
                  color: "#007AFF",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                {trainer.fullName
                  ? trainer.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "T"}
              </div>
              <div className="flex-grow-1">
                <h6 className="text-white mb-0 fw-bold">
                  {trainer.fullName || "Trainer"}
                </h6>
                <small className="text-white-50">Your trainer</small>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-grow-1 overflow-auto p-3"
            style={{
              background:
                "linear-gradient(180deg, #e0f7fa 0%, #ffffff 60%, #e8f5e9 100%)",
            }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted mt-5">
                <p>No messages yet. Start the conversation! 💬</p>
                <small className="text-muted">
                  Send a message to your trainer to get started.
                </small>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, idx) => {
                  const isSender = msg.senderId === clientId;
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
                            ? "linear-gradient(135deg, #007AFF 0%, #0056b3 100%)"
                            : "#ffffff",
                          background: isSender
                            ? "linear-gradient(135deg, #007AFF 0%, #0056b3 100%)"
                            : "#ffffff",
                          borderRadius: isSender
                            ? "20px 20px 0 20px"
                            : "20px 20px 20px 0",
                          border: isSender ? "none" : "1px solid rgba(0,0,0,0.1)",
                          color: isSender ? "#ffffff" : "#333",
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div style={{ fontSize: "0.95rem" }}>{msg.text}</div>
                        <div
                          className={`text-muted ${isSender ? "text-end" : "text-start"}`}
                          style={{
                            fontSize: "0.75rem",
                            marginTop: "4px",
                            color: isSender ? "rgba(255,255,255,0.8)" : "#666",
                          }}
                        >
                          {msg.timestamp?.toDate
                            ? msg.timestamp.toDate().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date(msg.timestamp).toLocaleTimeString([], {
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
            style={{
              background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
            }}
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
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="light"
                    className="rounded-circle me-2 border-0 shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                      width: "45px",
                      height: "45px",
                      backgroundColor: "#007AFF",
                      minWidth: "45px",
                      minHeight: "45px",
                    }}
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    type="button"
                  >
                    <FaSmile size={20} color="white" />
                  </Button>
                </motion.div>

                <Form.Control
                  placeholder="Type a message to your trainer..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="rounded-pill border-0 shadow-sm px-4 py-2"
                  style={{
                    backgroundColor: "#ffffff",
                    fontSize: "1rem",
                    minHeight: "45px",
                  }}
                />

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    className="rounded-circle ms-2 border-0 shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                      width: "45px",
                      height: "45px",
                      minWidth: "45px",
                      minHeight: "45px",
                      backgroundColor: "#007AFF",
                    }}
                    disabled={!newMessage.trim()}
                  >
                    <FaPaperPlane />
                  </Button>
                </motion.div>
              </InputGroup>
            </Form>
          </motion.div>
        </Card>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
          style={{ position: "fixed", top: "80px", right: "20px", zIndex: 1050 }}
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </motion.div>
      )}
    </div>
  );
};

export default ClientMessages;

