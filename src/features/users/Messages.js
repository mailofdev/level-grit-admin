import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
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

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
       <div className="container py-4">
      {/* Header */}
      {/* <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary btn-sm me-3"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>
        <h5 className="mb-0">Chat with Alex</h5>
      </div> */}
 <Heading pageName="Chat" sticky={true} />
      {/* Chat messages */}
      <div className="flex-grow-1 overflow-auto p-3 bg-light" style={{ flexBasis: 0 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex mb-3 ${msg.sender === "me" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div className={`p-2 rounded-3 ${msg.sender === "me" ? "bg-primary text-white" : "bg-white border"}`} style={{ maxWidth: "75%" }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <Card className="border-0 rounded-0">
        <Form onSubmit={handleSubmit}>
          <InputGroup className="p-3">
            <Form.Control
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit" variant="primary">
              <FaPaperPlane />
            </Button>
          </InputGroup>
        </Form>
      </Card>
    </div>
  );
}
