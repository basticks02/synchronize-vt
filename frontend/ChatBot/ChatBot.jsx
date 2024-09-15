import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, { role: 'user', content: input }]);

    try {
      const response = await axios.post('http://127.0.0.1:5001/chat', { message: input });
      const assistantMessage = response.data.response;
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    }

    setInput('');
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        {isOpen ? '✕' : '💬'}
      </button>
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}