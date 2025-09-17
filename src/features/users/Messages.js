import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { Card, Form, InputGroup, Button } from "react-bootstrap";
import Heading from "../../components/navigation/Heading";

export default function Messages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How are you?", sender: "other" },
    { id: 2, text: "I'm good, thanks! How about you?", sender: "me" },
    { id: 3, text: "Doing well!", sender: "other" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me" }]);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container mt-3 d-flex flex-column vh-100">
      <Heading pageName="Chat" sticky={true} />

      {/* Chat area */}
      <div className="flex-grow-1 overflow-auto p-3 my-2 shadow-md rounded" style={{ backgroundColor: "#f1f3f5" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex mb-3 ${msg.sender === "me" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`p-3 rounded-3 shadow-sm ${
                msg.sender === "me" ? "bg-primary white-text" : "bg-white border"
              }`}
              style={{ maxWidth: "75%", wordBreak: "break-word" }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area – sticky to bottom */}
      <Card className="border-0 shadow-sm rounded sticky-bottom my-3 bg-light">
        <Form onSubmit={handleSubmit}>
          <InputGroup className="p-3 ">
            <Form.Control
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border-0"
            />
            <Button type="submit" variant="primary" className="rounded-circle px-3">
              <FaPaperPlane />
            </Button>
          </InputGroup>
        </Form>
      </Card>
    </div>
  );
}
