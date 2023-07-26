export interface Chat {
  user: string;
  content: string;
  type: string;
  icon: string;
}

export interface MessageReceiver {
  user: string;
  type: number;
  message: string;
}