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

  function statusClasses(status: string) {
    switch (status) {
      case "Open":
        return "bg-blue-50 text-blue-700";

      case "Assigned":
        return "bg-green-50 text-green-700";

      case "Closed":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Chats
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage conversations with your users.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">Loading chats...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && chats.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl text-gray-500">💬</span>
            </div>

            <h2 className="text-base font-semibold text-gray-900">
              No chats found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              There are currently no conversations to display.
            </p>
          </div>
        )}

        {/* Chats */}
        {!loading && !error && chats.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Chat
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Widget
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Creator
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Last Message
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Sender
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Assigned Agent
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {chats.map((chat) => (
                    <tr
                      key={chat.chatId}
                      className="transition-colors hover:bg-gray-50"
                    >
                      {/* Chat */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          #{chat.chatId}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(
                            chat.status,
                          )}`}
                        >
                          {chat.status}
                        </span>
                      </td>

                      {/* Widget */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        #{chat.widgetId}
                      </td>

                      {/* Creator */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {displayName(chat.creatorId)}
                        </div>

                        {isValidUserId(chat.creatorId) && (
                          <div className="text-xs text-gray-400">
                            ID: {chat.creatorId}
                          </div>
                        )}
                      </td>

                      {/* Last message */}
                      <td className="max-w-xs px-5 py-4">
                        <p
                          className="truncate text-sm text-gray-600"
                          title={chat.lastMessage ?? ""}
                        >
                          {chat.lastMessage ?? "—"}
                        </p>
                      </td>

                      {/* Last message sender */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="text-sm text-gray-700">
                          {displayName(chat.lastMessageSenderId)}
                        </div>
                      </td>

                      {/* Assigned agent */}
                      <td className="whitespace-nowrap px-5 py-4">
                        {chat.assignedAgentId == null ? (
                          <span className="text-sm text-gray-400">
                            Unassigned
                          </span>
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {displayName(chat.assignedAgentId)}
                            </div>

                            {isValidUserId(chat.assignedAgentId) && (
                              <div className="text-xs text-gray-400">
                                ID: {chat.assignedAgentId}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Chats;
