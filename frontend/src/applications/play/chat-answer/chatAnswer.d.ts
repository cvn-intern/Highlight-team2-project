type Chat = {
  user: string;
  content: string;
  type: string;
  icon: string;
}

type MessageReceiver = {
  user: string;
  type: number;
  message: string;
  socketId?: string
}