export type ChatStatus = "Open" | "Assigned" | "Closed";

export type ChatInfo = {
  chatId: number;
  widgetId: number;
  createdAt: string;
  updatedAt: string;
  lastMessage: string | null;
  messagesCount: number;
  lastMessageSenderId: number | null;
  creatorId: number;
  assignedAgentId: number | null;
  status: ChatStatus;
  lastMessageAt: string | null;
};