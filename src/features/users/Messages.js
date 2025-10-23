import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import { Form, InputGroup, Button, Card } from "react-bootstrap";
import EmojiPicker from "emoji-picker-react";
import Heading from "../../components/navigation/Heading";
import { useLocation } from "react-router-dom";
import { sendMessage, subscribeToMessages } from "../../config/chatService";
import Loader from "../../components/display/Loader";

export default function Messages({ isTrainer = false }) {
  const location = useLocation();
  const client = location.state?.client;
  const trainer = location.state?.trainer;

  // Trainer & Client IDs depend on who is logged in
  const trainerId = isTrainer ? client?.trainerId : trainer?.trainerId;
  const clientId = isTrainer ? client?.clientId : client?.clientId;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    if (!trainerId || !clientId) return;
    const unsubscribe = subscribeToMessages(trainerId, clientId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [trainerId, clientId]);

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const senderId = isTrainer ? trainerId : clientId;
    await sendMessage(trainerId, clientId, senderId, newMessage.trim());
    setNewMessage("");
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
    return <Loader fullScreen text="Fetching Messages..." color="#0d6efd" />;
  }

  if ((!client && isTrainer) || (!trainer && !isTrainer)) {
    return (
      <p className="text-muted mt-4 text-center">
        Select {isTrainer ? "a client" : "a trainer"} to view messages.
      </p>
    );
  }

  return (
    <div className="container py-3">
      <Heading pageName={chatName} sticky={true} />

      <Card
        className="border-0 shadow-lg d-flex flex-column"
        style={{
          height: "calc(100vh - 160px)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
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
            </div>
          ) : (
            messages.map((msg) => {
              const isSender = msg.senderId === (isTrainer ? trainerId : clientId);
              return (
                <div
                  key={msg.id}
                  className={`d-flex mb-2 ${
                    isSender ? "justify-content-end" : "justify-content-start"
                  }`}
                >
                  <div
                    className="p-3 rounded-4 shadow-sm"
                    style={{
                      maxWidth: "70%",
                      wordBreak: "break-word",
                      backgroundColor: isSender ? "#d1f7c4" : "#ffffff",
                      borderRadius: isSender
                        ? "20px 20px 0 20px"
                        : "20px 20px 20px 0",
                    }}
                  >
                    <div style={{ fontSize: "0.95rem" }}>{msg.text}</div>
                    <div
                      className="text-end text-muted"
                      style={{ fontSize: "0.75rem", marginTop: "4px" }}
                    >
                      {msg.timestamp?.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-light p-3 position-relative border-top">
          {showEmojiPicker && (
            <div
              className="position-absolute"
              style={{
                bottom: "70px",
                left: "10px",
                zIndex: 1000,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "12px",
              }}
            >
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <InputGroup className="align-items-center">
              <Button
                variant="light"
                className="rounded-circle me-2 border-0 shadow-sm d-flex align-items-center justify-content-center"
                style={{
                  width: "45px",
                  height: "45px",
                  backgroundColor: "#0d6efd",
                }}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <FaSmile size={20} color="white" />
              </Button>

              <Form.Control
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="rounded-pill border-0 shadow-sm px-3 py-2"
                style={{
                  backgroundColor: "#f8f9fa",
                  fontSize: "1rem",
                }}
              />

              <Button
                type="submit"
                variant="success"
                className="rounded-circle ms-2 border-0 shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: "45px", height: "45px" }}
              >
                <FaPaperPlane />
              </Button>
            </InputGroup>
          </Form>
        </div>
      </Card>
    </div>
  );
}
