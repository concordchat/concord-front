import React, { useState } from 'react';
import { Smile, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  groupName: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, groupName }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="fixed w-full bottom-0 bg-[#0A0A0B]/80 backdrop-blur-md border-t border-[#1F1F23]">
      <div className="px-4 py-4 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Mensagem em #${groupName}`}
            className="w-full bg-[#1F1F23] text-[#E4E4E7] placeholder-[#9D9DA7] rounded-lg pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-[#2A2A2F] transition-all duration-200"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-[#9D9DA7] hover:text-[#E4E4E7] transition-all duration-200"
            >
              <Smile size={20} />
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 text-[#9D9DA7] hover:text-[#E4E4E7] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};