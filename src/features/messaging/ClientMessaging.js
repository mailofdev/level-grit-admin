import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Modal } from 'react-bootstrap';
import { FaPaperPlane, FaPaperclip, FaSmile, FaPhone, FaVideo, FaUser, FaClock, FaCheck, FaCheckDouble } from 'react-icons/fa';

const ClientMessaging = ({ clientId, clientName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'trainer',
        content: 'Hi Sarah! How are you feeling about your progress this week?',
        timestamp: '2024-01-20T10:30:00Z',
        read: true
      },
      {
        id: 2,
        sender: 'client',
        content: 'Hi! I\'m feeling great! I\'ve been following the meal plan and I can already see some changes.',
        timestamp: '2024-01-20T10:32:00Z',
        read: true
      },
      {
        id: 3,
        sender: 'trainer',
        content: 'That\'s fantastic! Keep up the great work. Don\'t forget to log your workouts in the app.',
        timestamp: '2024-01-20T10:35:00Z',
        read: true
      },
      {
        id: 4,
        sender: 'client',
        content: 'Will do! I have a question about the protein intake - should I increase it on workout days?',
        timestamp: '2024-01-20T10:37:00Z',
        read: true
      },
      {
        id: 5,
        sender: 'trainer',
        content: 'Yes, absolutely! On workout days, aim for 1.2-1.6g per kg of body weight. I\'ll update your meal plan to reflect this.',
        timestamp: '2024-01-20T10:40:00Z',
        read: false
      }
    ]);
  }, [clientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'trainer',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate client typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate client response
      const clientResponse = {
        id: Date.now() + 1,
        sender: 'client',
        content: 'Thanks for the quick response! I\'ll make sure to follow the updated plan.',
        timestamp: new Date().toISOString(),
        read: true
      };
      setMessages(prev => [...prev, clientResponse]);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const emojis = ['😊', '👍', '💪', '🔥', '🎉', '❤️', '😍', '🤔', '😅', '🙌'];

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="page-container">
      <Container fluid className="py-4">
        <Row>
          <Col>
            <Card className="content-wrapper card-health">
              <Card.Header className="bg-transparent border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                      {clientName ? clientName.split(' ').map(n => n[0]).join('') : 'C'}
                    </div>
                    <div>
                      <h4 className="fw-bold text-primary mb-1">{clientName || 'Client'}</h4>
                      <div className="d-flex align-items-center">
                        <Badge bg="success" className="me-2">Online</Badge>
                        <small className="text-muted">Last seen 2 minutes ago</small>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      <FaPhone />
                    </Button>
                    <Button variant="outline-primary" size="sm">
                      <FaVideo />
                    </Button>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                {/* Messages Area */}
                <div style={{ height: '500px', overflowY: 'auto', padding: '1rem' }}>
                  {messages.map((message, index) => {
                    const showDate = index === 0 || 
                      formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                    
                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="text-center my-3">
                            <Badge bg="secondary" className="px-3 py-2">
                              {formatDate(message.timestamp)}
                            </Badge>
                          </div>
                        )}
                        
                        <div className={`d-flex mb-3 ${message.sender === 'trainer' ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div className={`d-flex align-items-end ${message.sender === 'trainer' ? 'flex-row-reverse' : ''}`}>
                            {message.sender === 'client' && (
                              <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '35px', height: '35px'}}>
                                <FaUser size={16} />
                              </div>
                            )}
                            
                            <div className={`p-3 rounded-3 ${message.sender === 'trainer' ? 'bg-primary text-white me-2' : 'bg-light text-dark'}`} style={{maxWidth: '70%'}}>
                              <p className="mb-1">{message.content}</p>
                              <div className={`d-flex align-items-center small ${message.sender === 'trainer' ? 'text-white-50' : 'text-muted'}`}>
                                <FaClock className="me-1" size={10} />
                                <span className="me-2">{formatTime(message.timestamp)}</span>
                                {message.sender === 'trainer' && (
                                  message.read ? <FaCheckDouble className="text-info" size={10} /> : <FaCheck size={10} />
                                )}
                              </div>
                            </div>
                            
                            {message.sender === 'trainer' && (
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center ms-2" style={{width: '35px', height: '35px'}}>
                                <FaUser size={16} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {isTyping && (
                    <div className="d-flex justify-content-start mb-3">
                      <div className="d-flex align-items-end">
                        <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '35px', height: '35px'}}>
                          <FaUser size={16} />
                        </div>
                        <div className="bg-light p-3 rounded-3">
                          <div className="d-flex align-items-center">
                            <div className="typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                            <span className="ms-2 text-muted small">typing...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-top p-3">
                  <Form onSubmit={handleSendMessage}>
                    <div className="d-flex align-items-end">
                      <div className="flex-grow-1 me-3">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="smooth-transition"
                          style={{ resize: 'none' }}
                        />
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <FaSmile />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                        >
                          <FaPaperclip />
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          disabled={!newMessage.trim()}
                        >
                          <FaPaperPlane />
                        </Button>
                      </div>
                    </div>
                  </Form>

                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="mt-2 p-2 bg-light rounded">
                      <div className="d-flex flex-wrap gap-2">
                        {emojis.map((emoji, index) => (
                          <Button
                            key={index}
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => addEmoji(emoji)}
                            className="emoji-btn"
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #6c757d;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .emoji-btn {
          border: none !important;
          background: none !important;
          font-size: 1.2rem;
          padding: 0.25rem 0.5rem;
        }
        
        .emoji-btn:hover {
          background-color: #e9ecef !important;
        }
      `}</style>
    </div>
  );
};

export default ClientMessaging;
