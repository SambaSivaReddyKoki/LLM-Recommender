import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ChatMessage, MovieCard } from '../components';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Array<{
    title: string;
    year: number;
    genre: string;
    rating: number;
  }>;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionId') || uuidv4();
    }
    return uuidv4();
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save session ID to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionId', sessionId);
    }
  }, [sessionId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
    };

    // Update UI with user message
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/conversation', {
        messages: [...messages, userMessage].map(({ role, content }) => ({
          role,
          content,
        })),
        session_id: sessionId,
      });

      const { response: assistantResponse, recommendations } = response.data;

      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: 'assistant',
          content: assistantResponse,
          recommendations,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      <header className="py-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">🎬 Show & Movie Recommender</h1>
        <p className="text-gray-600 mt-1">Get personalized recommendations through conversation</p>
      </header>

      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">What kind of shows or movies are you in the mood for today?</p>
            <p className="mt-2 text-sm">Try something like "I want to watch a sci-fi movie from the 80s"</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-4">
              <ChatMessage message={message.content} isUser={message.role === 'user'} />
              {message.recommendations && message.recommendations.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Recommended for you:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {message.recommendations.map((movie, index) => (
                      <MovieCard key={index} movie={movie} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 pt-4 pb-6">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you like to watch?"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by OpenAI GPT-4 and LangChain
        </p>
      </div>
    </div>
  );
}
