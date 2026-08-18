import type { ChatInfo } from "../types/Chat";
import DataTable from "./DataTable";

type ChatsTableProps = {
  chats: ChatInfo[];
  userNames: Map<number, string>;
  usersLoading: boolean;
};

function ChatsTable({ chats, userNames, usersLoading }: ChatsTableProps) {
  function displayName(userId: number | null | undefined): string {
    if (userId == null || !Number.isFinite(userId) || userId <= 0) {
      return "—";
    }

    return userNames.get(userId) ?? (usersLoading ? "Loading…" : `#${userId}`);
  }

  const columns = [
    {
      key: "chat",
      header: "Chat",
      render: (chat: ChatInfo) => (
        <div>
          <div className="font-medium text-gray-900">Chat #{chat.chatId}</div>

          <div className="text-xs text-gray-500">Widget #{chat.widgetId}</div>
        </div>
      ),
    },

    {
      key: "status",
      header: "Status",
      render: (chat: ChatInfo) => {
        const statusClasses = {
          Open: "bg-blue-50 text-blue-700",
          Assigned: "bg-green-50 text-green-700",
          Closed: "bg-gray-100 text-gray-600",
        };

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              statusClasses[chat.status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {chat.status}
          </span>
        );
      },
    },

    {
      key: "creator",
      header: "Creator",
      render: (chat: ChatInfo) => (
        <span className="text-sm text-gray-700">
          {displayName(chat.creatorId)}
        </span>
      ),
    },

    {
      key: "lastMessage",
      header: "Last Message",
      render: (chat: ChatInfo) => (
        <div className="max-w-md">
          <div
            className="truncate text-sm text-gray-700"
            title={chat.lastMessage ?? ""}
          >
            {chat.lastMessage ?? "—"}
          </div>

          {chat.lastMessageSenderId != null && (
            <div className="mt-1 text-xs text-gray-400">
              {displayName(chat.lastMessageSenderId)}
            </div>
          )}
        </div>
      ),
    },

    {
      key: "assignedAgent",
      header: "Assigned Agent",
      render: (chat: ChatInfo) => (
        <span className="text-sm text-gray-700">
          {chat.assignedAgentId == null
            ? "Unassigned"
            : displayName(chat.assignedAgentId)}
        </span>
      ),
    },

    {
      key: "updated",
      header: "Updated",
      render: (chat: ChatInfo) => (
        <span className="whitespace-nowrap text-sm text-gray-500">
          {chat.updatedAt ? new Date(chat.updatedAt).toLocaleString() : "—"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      items={chats}
      columns={columns}
      getRowKey={(chat) => chat.chatId}
    />
  );
}

export default ChatsTable;
