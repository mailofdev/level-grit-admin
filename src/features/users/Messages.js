import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Form, InputGroup, Button } from "react-bootstrap";
import Heading from "../../components/navigation/Heading";

export default function Messages() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How are you?", sender: "other", time: "10:30 AM" },
    { id: 2, text: "I'm good, thanks! How about you?", sender: "me", time: "10:32 AM" },
    { id: 3, text: "Doing well!", sender: "other", time: "10:33 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages([
      ...messages,
      { id: Date.now(), text: newMessage, sender: "me", time },
    ]);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container">
      <Heading pageName="Chat" sticky={true} />
            <div  className="d-flex flex-column" style={{  height: 'calc(100vh - 160px)',
          // overflow: 'hidden'
          }}>

      {/* Chat messages */}
      <div className="flex-grow-1 overflow-auto p-3 rounded shadow-sm" style={{ backgroundColor: "#ece5dd" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex mb-2 ${msg.sender === "me" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`p-2 rounded-3 shadow-sm position-relative`}
              style={{
                maxWidth: "70%",
                backgroundColor: msg.sender === "me" ? "#d1f7c4" : "#fff",
  
              }}
            >
              <div>{msg.text}</div>
              <div className="" style={{textAlign:'right', fontSize:12}}>
              <small className="text-muted" >{msg.time}</small>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 rounded mt-2 bg-light-blue shadow-sm">
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
              className="rounded-circle d-flex align-items-center justify-content-center ms-2"
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
