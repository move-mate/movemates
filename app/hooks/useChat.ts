import { useState, useRef, useEffect, useCallback } from "react";
import { Message } from "../types/chat";
import {
  addConversationalElements,
  enhanceContextForRole,
  getConversationStage,
} from "@/libs/chatbot";

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! I'm here to help you. Please select your role:",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (selectedRole) {
      inputRef.current?.focus();
    }
  }, [selectedRole]);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleRoleSelect = useCallback(
    (role: string) => {
      setSelectedRole(role);
      addMessage({
        id: Date.now().toString(),
        role: "bot",
        content: `Great! You've selected ${role}. How can I assist you today?`,
        timestamp: new Date(),
      });
    },
    [addMessage],
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (inputValue.split(" ").length <= 2) {
      addMessage({
        id: Date.now().toString(),
        role: "bot",
        content: "Please type a longer question",
        timestamp: new Date(),
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setInputValue("");
    addMessage(userMessage);
    setIsLoading(true);
    const conversationalElements = addConversationalElements(
      inputValue.trim(),
      getConversationStage(messages),
    );

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query:
            conversationalElements +
            " Role Enhancement: " +
            enhanceContextForRole(selectedRole as string),
          role: selectedRole,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      addMessage({
        id: Date.now().toString(),
        role: "bot",
        content: data.response,
        timestamp: new Date(),
      });
    } catch {
      addMessage({
        id: Date.now().toString(),
        role: "bot",
        content:
          "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    selectedRole,
    handleRoleSelect,
    handleSubmit,
    inputRef,
    messagesEndRef,
  };
}
