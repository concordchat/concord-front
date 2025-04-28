import React from 'react';
import { Message } from '../types';
import { formatDistanceToNow } from '../utils';
import { UserAvatar } from './UserAvatar';
import { Clock } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`lg:px-36 px-4 py-2 group flex items-start gap-4 relative hover:bg-[#1F1F23]/50 transition-all duration-200 ${isCurrentUser ? 'bg-[#1F1F23]/30' : ''}`}>
      <div className="relative flex-shrink-0 w-10 h-10">
        <UserAvatar name={message.user.name} color={message.user.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-base text-white hover:text-white/90 cursor-pointer">
            {message.user.name}
          </span>
          <div className="flex items-center gap-1 text-xs text-[#9D9DA7]">
            <Clock size={12} />
            <span>{formatDistanceToNow(message.created_at)}</span>
          </div>
        </div>
        <p className="text-[#E4E4E7] break-words leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
};