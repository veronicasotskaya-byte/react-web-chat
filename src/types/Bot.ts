import type { Command } from "./Command";
import type { WelcomeMessage } from "./WelcomeMessage";

export type { Command } from "./Command";
export type { WelcomeMessage, Message } from "./WelcomeMessage";

export type Bot = {
  botId: number;
  username: string;
  name: string;
  description: string;
  webhookUrl: string;
  formattedToken: string;
  avatarUrl: string | null;
  commands: Command[];
  welcomeMessages: WelcomeMessage[];
};
