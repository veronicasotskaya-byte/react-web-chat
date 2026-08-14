import { withTenant } from "./withTenant";

export async function getBots(tenantId?: string | null) {
  const response = await fetch(withTenant("/api/bot-management", tenantId), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load bots");
  }

  return response.json();
}

export async function saveBot(bot: unknown, tenantId?: string | null) {
  const response = await fetch(withTenant("/api/bot-management", tenantId), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bot),
  });

  if (!response.ok) {
    throw new Error("Failed to save bot");
  }

  return response.json();
}

export async function deleteBot(botId: number, tenantId?: string | null) {
  if (botId == null || Number.isNaN(Number(botId))) {
    throw new Error("Failed to delete bot: missing botId");
  }

  const response = await fetch(
    withTenant(`/api/bot-management/${botId}`, tenantId),
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `Failed to delete bot (${response.status})${details ? `: ${details}` : ""}`,
    );
  }

  // API may return boolean JSON, empty body, or 204
  const text = await response.text();
  if (!text) {
    return true;
  }

  try {
    return JSON.parse(text) as boolean;
  } catch {
    return true;
  }
}

export async function getBotToken(botId: number, tenantId?: string | null) {
  const response = await fetch(
    withTenant(`/api/bot-management/${botId}/token`, tenantId),
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load token");
  }

  return response.json();
}

export async function saveBotToken(botId: number, tenantId?: string | null) {
  const response = await fetch(
    withTenant(`/api/bot-management/${botId}/token`, tenantId),
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to save token");
  }

  return response.json();
}
