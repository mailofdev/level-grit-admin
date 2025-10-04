import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Form, InputGroup, Button } from "react-bootstrap";
import Heading from "../../components/navigation/Heading";
import { useLocation } from "react-router-dom";
import { sendMessage, subscribeToMessages } from "../../config/chatService";

export default function Messages() {
  const location = useLocation();
  const client = location.state?.client;
  const trainerId = client?.trainerId;
  const clientId = client?.clientId;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Subscribe to messages
  useEffect(() => {
    if (!trainerId || !clientId) return;

    const unsubscribe = subscribeToMessages(trainerId, clientId, setMessages);
    return () => unsubscribe();
  }, [trainerId, clientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(trainerId, clientId, trainerId, newMessage.trim());
    setNewMessage("");
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!client) {
    return (
      <p className="text-muted mt-4 text-center">
        Select a client to view messages.
      </p>
    );
  }

  return (
    <div className="container">
      <Heading pageName={`Chat with ${client.fullName}`} sticky={true} />

      <div
        className="d-flex flex-column"
        style={{ height: "calc(100vh - 160px)" }}
      >
        {/* Messages */}
        <div
          className="flex-grow-1 overflow-auto p-3 rounded shadow-sm"
          style={{ backgroundColor: "#ece5dd" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex mb-2 ${
                msg.senderId === trainerId
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className="p-2 rounded-3 shadow-sm"
                style={{
                  maxWidth: "70%",
                  backgroundColor:
                    msg.senderId === trainerId ? "#d1f7c4" : "#fff",
                }}
              >
                <div>{msg.text}</div>
                <div className="text-end" style={{ fontSize: 12 }}>
                  <small className="text-muted">
                    {msg.timestamp?.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 rounded mt-2 bg-light shadow-sm">
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Form.Control
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="rounded-pill border-0 bg-light px-3"
              />
              <Button
                type="submit"
                variant="success"
                className="rounded-circle ms-2"
                style={{ width: "45px", height: "45px" }}
              >
                <FaPaperPlane />
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>
    </div>
  );
}
