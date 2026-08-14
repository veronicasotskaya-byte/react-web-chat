import type { Bot } from "../types/Bot";
import "../styles/BotCard.css";

type BotCardProps = {
  bot: Bot;
  onDelete: (id: number) => void;
  onEdit: (bot: Bot) => void;
};

function BotCard({ bot, onDelete, onEdit }: BotCardProps) {
  return (
    <div className="bot-card">
      <h3>{bot.name}</h3>
      <p>Username: {bot.username}</p>
      <p>Description: {bot.description}</p>

      <button type="button" onClick={() => onEdit(bot)}>
        Edit
      </button>

      <button type="button" onClick={() => onDelete(bot.botId)}>
        Delete
      </button>
    </div>
  );
}

export default BotCard;
