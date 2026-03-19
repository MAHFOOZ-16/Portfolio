import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function ChatMessage({ message, index }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {!isUser && (
        <div className="chat-message__avatar">
          <Bot size={16} />
        </div>
      )}
      <div className="chat-message__bubble">
        <p>{message.content}</p>
      </div>
    </motion.div>
  );
}
