import type { Bot } from "../types/Bot";
import DataTable from "./DataTable";

type BotTableProps = {
  bots: Bot[];
  onDelete: (id: number) => void;
  onEdit: (bot: Bot) => void;
};

function BotTable({ bots, onDelete, onEdit }: BotTableProps) {
  const columns = [
    {
      key: "id",
      header: "ID",
      render: (bot: Bot) => (
        <span className="text-sm text-gray-600">{bot.botId}</span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (bot: Bot) => (
        <span className="text-sm font-medium text-gray-900">{bot.name}</span>
      ),
    },
    {
      key: "username",
      header: "Username",
      render: (bot: Bot) => (
        <span className="text-sm text-gray-600">{bot.username}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (bot: Bot) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(bot)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(bot.botId)}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable items={bots} columns={columns} getRowKey={(bot) => bot.botId} />
  );
}

export default BotTable;
