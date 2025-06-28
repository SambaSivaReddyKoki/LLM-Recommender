import React from 'react';
import { UserCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-100 text-blue-600 ml-3' : 'bg-gray-100 text-gray-600 mr-3'}`}>
          {isUser ? (
            <UserCircleIcon className="h-5 w-5" />
          ) : (
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
          )}
        </div>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-none'
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}
        >
          <div className="prose prose-sm max-w-none">
            {message.split('\n').map((paragraph, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
