import type { Command } from "../types/Command";
import Button_small from "./Button_small";

type Props = {
  command: Command;
  onEdit: (command: Command) => void;
  onDelete: (commandId: number) => void;
};

function BotCommandItem({ command, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold text-gray-900">{command.text}</p>

      <p className="mt-1 text-sm text-gray-600">{command.description}</p>

      <div className="mt-3 flex gap-2">
        <Button_small text="Edit" onClick={() => onEdit(command)} />
        <Button_small
          text="Delete"
          onClick={() => onDelete(command.commandId)}
        />
      </div>
    </div>
  );
}

export default BotCommandItem;
