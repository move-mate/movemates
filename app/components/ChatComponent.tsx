import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ChatComponentProps } from '../types/chat';
import { Message } from '../types/chat';
import { addConversationalElements, enhanceContextForRole, getConversationStage } from '@/libs/chatbot';
import { formatMessage } from '@/libs/formatting';
// import { processResponseForDisplay } from '@/libs/formatting';

  // Create a component to render formatted messages
const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
    return (
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatMessage(content) 
        }} 
      />
    );
  };

const ChatComponent: React.FC<ChatComponentProps> = ({ onClose, isWaitlistOpen }) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'bot',
    content: "Hello! I'm here to help you. Please select your role:",
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Optimized scroll handling
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Auto-focus input after role selection
  useEffect(() => {
    if (selectedRole) {
      inputRef.current?.focus();
    }
  }, [selectedRole]);

  // Optimized message handling
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleRoleSelect = useCallback((role: string) => {
    setSelectedRole(role);
    addMessage({
      id: Date.now().toString(),
      role: 'bot',
      content: `Great! You've selected ${role}. How can I assist you today?`,
      timestamp: new Date()
    });
  }, [addMessage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if(inputValue.split(" ").length<=2){
      addMessage({
        id: Date.now().toString(),
        role: 'bot',
        content: "Please type a longer question",
        timestamp: new Date()
      });
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setInputValue('');
    addMessage(userMessage);
    setIsLoading(true);
    const conversationalElements = addConversationalElements(inputValue.trim(),getConversationStage(messages))
    console.log(conversationalElements)
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: conversationalElements+" Role Enhancement: "+enhanceContextForRole(selectedRole as string),
          role: selectedRole
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      // const formatedResponse = processResponseForDisplay(data.response)
      addMessage({
        id: Date.now().toString(),
        role: 'bot',
        content: data.response,
        timestamp: new Date()
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      addMessage({
        id: Date.now().toString(),
        role: 'bot',
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-0 right-0 md:bottom-8 md:right-4 w-full md:w-[450px] h-[100vh] md:h-auto bg-white rounded-none md:rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
      isWaitlistOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Header */}
      <div className="bg-[#081427] p-3 md:p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-3">
          <Image 
            src="/assets/images/bot.png" 
            alt="Chat Assistant" 
            width={32}
            height={32}
            className="rounded-full border-2 border-[#FE6912] md:w-10 md:h-10" 
          />
          <span className="text-white font-semibold text-sm md:text-base">MoveMates Assistant</span>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-[#FE6912] transition-colors"
          aria-label="Close chat"
        >
          <X size={20} className="md:w-6 md:h-6" />
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="h-[calc(100vh-120px)] md:h-[500px] overflow-y-auto p-3 md:p-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-2 mb-3 md:mb-4">
            <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8">
              <Image 
                src={message.role === 'bot' ? "/assets/images/bot.png" : "/assets/images/user.png"}
                alt={message.role === 'bot' ? "Assistant" : "User"}
                width={32}
                height={32}
                className="rounded-full border-2 border-[#FE6912]"
              />
            </div>
            <div className={`${
              message.role === 'bot' 
                ? 'bg-[#081427] text-white' 
                : 'bg-[#FE6912] text-white'
              } p-2 md:p-3 rounded-lg text-sm md:text-base ${
                message.role === 'bot' ? 'rounded-tl-none' : 'rounded-tr-none'
              } max-w-[85%] md:max-w-[80%]`}>
              {message.role === 'bot' && !selectedRole ? (
                <>
                  <p className="mb-2 md:mb-3">{message.content}</p>
                  <div className="flex flex-col gap-2 md:gap-3">
                    {['mover', 'business', 'driver'].map((role) => (
                      <label 
                        key={role} 
                        className="flex items-center gap-2 cursor-pointer hover:bg-black/10 p-1 rounded transition-colors"
                      >
                        <input 
                          type="radio" 
                          name="userRole" 
                          value={role}
                          checked={selectedRole === role}
                          onChange={() => handleRoleSelect(role)}
                          className="w-4 h-4 accent-[#FE6912]"
                        />
                        <span>I&apos;m a {role}</span>
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                
                <div className="whitespace-pre-wrap"><FormattedMessage content={message.content} /></div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex gap-2 mb-3 md:mb-4">
            <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8">
              <Image 
                src="/assets/images/bot.png"
                alt="Assistant"
                width={32}
                height={32}
                className="rounded-full border-2 border-[#FE6912]"
              />
            </div>
            <div className="bg-[#081427] text-white p-2 md:p-3 rounded-lg rounded-tl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 md:p-4 border-t">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={!selectedRole || isLoading}
            className="flex-1 p-2 text-sm md:text-base border rounded-full focus:outline-none focus:border-[#FE6912] disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button 
            type="submit"
            disabled={!selectedRole || isLoading || !inputValue.trim()}
            className="bg-[#FE6912] text-white px-4 md:px-6 py-2 rounded-full hover:bg-[#FF8A47] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;