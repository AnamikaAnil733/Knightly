export interface Message {
  sender: string;
  text: string;
  time: string;
  socketId?: string;
}

export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}
