export interface Message {
  user: { name: string; profileImg: string };
  message: { text: string; uId: string };
}

export type MessageState = Message[];
