import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';

const STARTER_QUESTIONS = [
  "What are Ahmed's key skills?",
  "Tell me about his work experience",
  "What projects has he built?",
  "What certifications does he hold?",
];

export default function ChatWindow({ messages, isTyping, error, onSend, onClose }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;
    onSend(text);
    setInput('');
  };

  const handleStarterClick = (question) => {
    if (isTyping) return;
    onSend(question);
  };

  const showStarters = messages.length === 0;

  return (
    <motion.div
      className="chat-window"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {/* Header */}
      <div className="chat-window__header">
        <div className="chat-window__header-info">
          <div className="chat-window__header-avatar">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="chat-window__header-name">Valerio</h3>
            <span className="chat-window__header-status">
              <span className="chat-window__status-dot" />
              Ahmed's AI Assistant
            </span>
          </div>
        </div>
        <button className="chat-window__close" onClick={onClose} aria-label="Close chat">
          <X size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="chat-window__messages">
        {/* Welcome message */}
        {showStarters && (
          <div className="chat-window__welcome">
            <div className="chat-window__welcome-icon">
              <Sparkles size={28} />
            </div>
            <h4>Hey there! I'm Valerio</h4>
            <p>Ahmed's AI assistant. Ask me anything about his skills, projects, or experience!</p>

            <div className="chat-window__starters">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  className="chat-window__starter-chip"
                  onClick={() => handleStarterClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} index={i} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar">
              <Bot size={16} />
            </div>
            <div className="chat-message__bubble chat-message__typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="chat-window__error">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form className="chat-window__input-area" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="chat-window__input"
          placeholder="Ask about Ahmed..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          disabled={isTyping}
        />
        <button
          type="submit"
          className="chat-window__send"
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
}
