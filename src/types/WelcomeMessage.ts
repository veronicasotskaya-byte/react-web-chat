export type Message = {
  senderId: number;
  messageId: number;
  replyToMessageId: number;
  text: string;
  imageId: number;
  buttons: unknown[];
  format: string;
  timestamp: string;
  imagePath: string;
  imageUrl: string | null;
};

export type WelcomeMessage = {
  welcomeMessageId: number;
  message: Message | null;
  delay: number;
  typingDuration: number;
  externalId: string;
};
