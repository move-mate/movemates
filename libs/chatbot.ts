import { Message } from "@/app/types/chat";
export function enhanceContextForRole(role: string): string|null {
    const roleContext = {
      mover: "Remember you're speaking to a mover who's interested in finding work and connecting with customers. Focus on opportunities, requirements, and how MoveMates can help them succeed.",
      business: "You're speaking to a business owner interested in shipping or moving services. Focus on logistics solutions, business benefits, and how MoveMates can help their operations.",
      driver: "You're speaking to a driver interested in delivery opportunities. Focus on route flexibility, earning potential, and how MoveMates can support their driving career."
    }[role] || "";
  
    return roleContext;
  }
  
export function getConversationStage(messages: Message[]): 'initial' | 'exploring' | 'detailed' {
    if (messages.length <= 2) return 'initial';
    if (messages.length <= 5) return 'exploring';
    return 'detailed';
  }
  
export function addConversationalElements(response: string, stage:'initial' | 'exploring' | 'detailed' ): string {
    const stageEnhancements = {
      initial: [
        "I'd love to help you learn more about this.",
        "What specific aspects would you like to explore?",
        "Let me know if you need any clarification!"
      ],
      exploring: [
        "That's a great question about MoveMates.",
        "I understand what you're looking for.",
        "Let me explain how this works for you."
      ],
      detailed: [
        "Based on what you've told me...",
        "Given your interests in MoveMates...",
        "I can definitely help you with those details."
      ]
    };
  
    const enhancements = stageEnhancements[stage] || stageEnhancements.initial;
    const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    
    return `Query: ${response} Enhancement: ${randomEnhancement}`;
  }