import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatBubble from './ChatBubble';
import ChatWindow from './ChatWindow';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    setError(null);
    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <ChatWindow
          key="window"
          messages={messages}
          isTyping={isTyping}
          error={error}
          onSend={sendMessage}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <ChatBubble key="bubble" onClick={() => setIsOpen(true)} />
      )}
    </AnimatePresence>
  );
}
