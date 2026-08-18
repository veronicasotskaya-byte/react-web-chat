import type { Bot } from "../types/Bot";
import Avatar from "./Avatar";

type BotCardProps = {
  bot: Bot;
  onDelete: (id: number) => void;
  onEdit: (bot: Bot) => void;
};

function BotCard({ bot, onDelete, onEdit }: BotCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={bot.name} id={bot.botId} />
          <span className="text-base font-semibold text-gray-900">
            {bot.name}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2 border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(bot)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(bot.botId)}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BotCard;
