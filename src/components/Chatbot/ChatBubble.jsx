import { MessageCircle } from 'lucide-react';

export default function ChatBubble({ onClick }) {
  return (
    <motion.button
      className="chat-bubble"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      aria-label="Open chat"
    >
      <div className="chat-bubble__glow" />
      <MessageCircle size={24} />
    </motion.button>
  );
}
