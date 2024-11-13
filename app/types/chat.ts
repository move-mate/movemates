// types/chat.ts
export interface EmbeddingDocument {
    embedding: number[];
    value: string;
  }
  
export interface CachedData {
  essayHash: string;
  embeddings: EmbeddingDocument[];
}

export interface ChatRequest {
  query: string;
  role: string;
}

export interface ChatResponse {
  response: string;
}

export interface ErrorResponse {
  error: string;
}

export class ChatError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

export interface ChatContext {
  role: 'mover' | 'business' | 'driver';
  previousMessages: Message[];
  query: string;
  context: string;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}


export interface ChatComponentProps {
  onClose: () => void;
  isWaitlistOpen?: boolean;
}