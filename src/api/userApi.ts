import { withTenant } from "./withTenant";

export type ChatUser = {
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
  timeZone: string;
  userId: number;
  externalUserId: string;
};

type UsersResponse = Record<string, ChatUser> | ChatUser[];

export async function getUsers(
  userIds: number[],
  tenantId: string | null,
): Promise<ChatUser[]> {
  const uniqueIds = [...new Set(userIds.filter((id) => Number.isFinite(id) && id > 0))];

  if (uniqueIds.length === 0) {
    return [];
  }

  const params = new URLSearchParams();

  for (const userId of uniqueIds) {
    params.append("userIds", String(userId));
  }

  const url = withTenant(`/api/Users?${params.toString()}`, tenantId);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load users (${response.status}): ${await response.text()}`,
    );
  }

  const data: UsersResponse = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  return Object.values(data);
}
