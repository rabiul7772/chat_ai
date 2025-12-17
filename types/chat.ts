export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: Omit<Message, "id" | "timestamp">[];
  model?: string;
}

export interface ChatResponse {
  message: Message;
  error?: string;
}

