import type { ChatInfo, ChatStatus } from "../types/Chat";
import { withTenant } from "./withTenant";

type GetUserChatsParams = {
  userId: number;
  tenantId: string | null;
  widgetId?: number;
  chatStatuses?: ChatStatus[];
  skip?: number;
  take?: number;
};

export async function getUserChats({
  userId,
  tenantId,
  widgetId,
  chatStatuses,
  skip = 0,
  take = 30,
}: GetUserChatsParams): Promise<ChatInfo[]> {
  const params = new URLSearchParams();

  if (widgetId !== undefined) {
    params.set("WidgetId", String(widgetId));
  }

  if (chatStatuses && chatStatuses.length > 0) {
    for (const status of chatStatuses) {
      params.append("ChatStatuses", status);
    }
  }

  params.set("Skip", String(skip));
  params.set("Take", String(take));

  const baseUrl = `/api/Chat/user/${userId}`;
  const urlWithParams = `${baseUrl}?${params.toString()}`;
  const url = withTenant(urlWithParams, tenantId);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load chats (${response.status}): ${await response.text()}`,
    );
  }

  const data: unknown = await response.json();

  if (Array.isArray(data)) {
    return data as ChatInfo[];
  }

  if (data && typeof data === "object") {
    return [data as ChatInfo];
  }

  return [];
}
