import type { Command } from "../types/Command";
import Button_small from "./Button_small";

type Props = {
  command: Command;
  onEdit: (command: Command) => void;
  onDelete: (commandId: number) => void;
};

function BotCommandItem({ command, onEdit, onDelete }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <strong>{command.text}</strong>

      <p>{command.description}</p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "10px",
          width: "fit-content",
        }}
      >
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
