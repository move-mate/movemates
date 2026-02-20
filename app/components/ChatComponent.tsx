import React from "react";
import { X, ArrowRight } from "lucide-react";
import { ChatComponentProps } from "../types/chat";
import { formatMessage } from "@/libs/formatting";
import useChat from "../hooks/useChat";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar } from "./ui/avatar";

const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: formatMessage(content),
      }}
    />
  );
};

export default function ChatComponent({
  onClose,
  isWaitlistOpen,
}: ChatComponentProps) {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    selectedRole,
    handleRoleSelect,
    handleSubmit,
    inputRef,
    messagesEndRef,
  } = useChat();

  return (
    <div
      className={`flex flex-col h-[85vh] md:h-[600px] w-full bg-white transition-all duration-300 ${
        isWaitlistOpen ? "opacity-30 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="bg-white/90 backdrop-blur-lg px-5 py-4 flex justify-between items-center border-b border-slate-100 relative z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar role="bot" alt="Chat Assistant" size={40} />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#081427] font-extrabold text-base leading-tight">
              MoveMates Assistant
            </span>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              AI Support • Online
            </span>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          className="p-2 h-auto text-slate-400 border-none hover:text-primary hover:bg-slate-50 rounded-full transition-all"
          aria-label="Close chat"
        >
          <X size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-[#FAFAFA] space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "bot" ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${message.role === "bot" ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="flex-shrink-0 mt-1">
                <Avatar role={message.role as "bot" | "user"} />
              </div>
              <div
                className={`p-4 rounded-2xl text-sm md:text-[15px] leading-relaxed shadow-sm ${
                  message.role === "bot"
                    ? "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                    : "bg-primary text-white rounded-tr-none"
                }`}
              >
                {message.role === "bot" && !selectedRole ? (
                  <div className="space-y-4">
                    <p className="font-semibold text-slate-900">
                      {message.content}
                    </p>
                    <div className="flex flex-col gap-2">
                      {["mover", "driver"].map((role) => (
                        <Button
                          key={role}
                          variant="ghost"
                          onClick={() => handleRoleSelect(role)}
                          className="flex items-center justify-between px-4 py-3 w-full rounded-xl border border-slate-100 bg-slate-50 hover:bg-orange-50 hover:border-orange-100 hover:text-primary text-slate-600 font-semibold transition-all group"
                        >
                          <span>I&apos;m a {role}</span>
                          <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    <FormattedMessage content={message.content} />
                  </div>
                )}
                <span
                  className={`text-[10px] block mt-2 opacity-50 ${message.role === "bot" ? "text-slate-400" : "text-orange-100"}`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3 max-w-[80%]">
              <div className="flex-shrink-0">
                <Avatar role="bot" className="opacity-50" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <div className="relative flex-1 group">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                selectedRole ? "Type your message..." : "Select a role first..."
              }
              disabled={!selectedRole || isLoading}
              containerClassName="!space-y-0"
              className="w-full pl-5 pr-12 py-3.5 text-[15px] border-2 border-slate-100 bg-slate-50/50 rounded-2xl focus:outline-none focus:border-primary focus:ring-0 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400"
            />
            <Button
              type="submit"
              disabled={!selectedRole || isLoading || !inputValue.trim()}
              className="absolute right-2 top-1.5 p-2 h-auto min-w-0 bg-primary text-white rounded-xl border-none hover:bg-primary/80 disabled:bg-slate-200 transition-all shadow-md shadow-orange-500/10"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-3 font-medium lowercase italic tracking-tight">
          AI may produce inaccurate info. Verify important details.
        </p>
      </div>
    </div>
  );
}
