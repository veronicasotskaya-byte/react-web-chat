import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";

import type { AppDispatch, RootState } from "../app/store";

import {
  fetchChats,
  fetchChatUsers,
  selectAllChats,
} from "../features/chat/chatsSlice";

function isValidUserId(id: number | null | undefined): id is number {
  return id != null && Number.isFinite(id) && id > 0;
}

function Chats() {
  const dispatch = useDispatch<AppDispatch>();

  const chats = useSelector(selectAllChats);
  const users = useSelector((state: RootState) => state.chats.users);
  const loading = useSelector((state: RootState) => state.chats.loading);
  const usersLoading = useSelector(
    (state: RootState) => state.chats.usersLoading,
  );
  const error = useSelector((state: RootState) => state.chats.error);

  useEffect(() => {
    void dispatch(fetchChats());
  }, [dispatch]);

  const userIds = useMemo(() => {
    const ids = new Set<number>();

    for (const chat of chats) {
      if (isValidUserId(chat.creatorId)) {
        ids.add(chat.creatorId);
      }

      if (isValidUserId(chat.lastMessageSenderId)) {
        ids.add(chat.lastMessageSenderId);
      }

      if (isValidUserId(chat.assignedAgentId)) {
        ids.add(chat.assignedAgentId);
      }
    }

    return [...ids];
  }, [chats]);

  const userIdsKey = userIds.join(",");

  useEffect(() => {
    if (userIds.length === 0) {
      return;
    }

    void dispatch(fetchChatUsers(userIds));
  }, [dispatch, userIds, userIdsKey]);

  const userNames = useMemo(() => {
    const map = new Map<number, string>();

    for (const user of users) {
      if (isValidUserId(user.userId) && user.name) {
        map.set(user.userId, user.name);
      }
    }

    return map;
  }, [users]);

  function displayName(userId: number | null | undefined): string {
    if (!isValidUserId(userId)) {
      return "—";
    }

    return userNames.get(userId) ?? (usersLoading ? "Loading…" : `#${userId}`);
  }

  return (
    <DashboardLayout>
      <h1>Chats</h1>

      {loading && <p>Loading chats...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && chats.length === 0 && <p>No chats found.</p>}

      {!loading &&
        chats.map((chat) => (
          <div
            key={chat.chatId}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            <strong>Chat #{chat.chatId}</strong>

            <div>Status: {chat.status}</div>

            <div>Widget: {chat.widgetId}</div>

            <div>Creator: {displayName(chat.creatorId)}</div>

            <div>Last message: {chat.lastMessage ?? "—"}</div>

            <div>
              Last message sender: {displayName(chat.lastMessageSenderId)}
            </div>

            <div>
              Assigned agent:{" "}
              {chat.assignedAgentId == null
                ? "Unassigned"
                : displayName(chat.assignedAgentId)}
            </div>
          </div>
        ))}
    </DashboardLayout>
  );
}

export default Chats;
