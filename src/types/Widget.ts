export type WidgetAction = "Assign" | "Notify";

export type ExternalIdVerificationMethod = {
  method: string;
};

export type VerifyExternalId = {
  url: string;
  method: ExternalIdVerificationMethod;
  externalIdLocation: string;
  externalIdParamName: string;
  sessionParameterLocation: string;
  sessionTokenParamName: string;
};

export type WidgetAgent = {
  widgetAgentId: number;
  agentId: number;
  action: 'Assign' | 'Notify';
  priority: number;
  enabled: boolean;
};

export type Widget = {
  verifyExternalId: VerifyExternalId | null;

  widgetId: number;
  tenantId: string | null;

  name: string;
  avatarUrl: string | null;
  publicWidgetId: string | null;

  enabled: boolean;
  standAlonePublic: boolean;

  agents: WidgetAgent[];

  allowedOrigins: string[];
};

export type PublicWidgetMessage = {
  senderId: number;
  messageId: number;
  replyToMessageId: number;
  text: string;
  imageId: number;
  buttons: PublicWidgetButton[][];
  format: string;
  timestamp: string;
  imagePath: string;
  imageUrl: string;
};

export type PublicWidgetButton = {
  text: string;
  callbackData: string;
  url: string;
};

export type PublicWidgetWelcomeMessage = {
  welcomeMessageId: number;
  message: PublicWidgetMessage;
  delay: number;
  typingDuration: number;
  externalId: string;
};

export type PublicWidgetAssignedAgent = {
  userId: number;
  welcomeMessages: PublicWidgetWelcomeMessage[];
};

export type PublicWidget = {
  widgetId: number;
  publicWidgetId: string;
  tenantId: string;
  name: string;
  avatarUrl: string;
  assignedAgent?: {
    userId: number;
    welcomeMessages: {
      welcomeMessageId: number;
      message: {
        senderId: number;
        messageId: number;
        replyToMessageId: number;
        text: string;
        imageId: number;
        buttons: {
          text: string;
          callbackData: string;
          url: string;
        }[][];
        format: string;
        timestamp: string;
        imagePath: string;
        imageUrl: string;
      };
      delay: number;
      typingDuration: number;
      externalId: string;
    }[];
  };
};