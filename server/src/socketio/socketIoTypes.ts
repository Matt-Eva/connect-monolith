export interface AstraMessage {
  chat_id: string;
  user_id: string;
  text: string;
  id: string;
  date: number;
  user_profile_url: string;
  user_name_url: string;
}

export interface IncomingMessage {
  userId: string;
  chatId: string;
  text: string;
  usernames: string;
}

export interface CreatedMessage {
  user: {
    name: string;
    profileImg: string;
  };
  message: {
    text: string;
    uId: string;
    date: number;
    userId: string;
  };
}
