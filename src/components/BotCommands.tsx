import { useState } from "react";
import type { Command } from "../types/Command";

import BotCommandItem from "./BotCommandItem";
import BotCommandForm from "./BotCommandForm";
import Button_small from "./Button_small";

type Props = {
  commands: Command[];
  onChange: (commands: Command[]) => void;
};

function BotCommands({ commands, onChange }: Props) {
  const [editingCommand, setEditingCommand] = useState<Command | undefined>();
  const [showForm, setShowForm] = useState(false);

  function handleAdd(command: Command) {
    onChange([...commands, command]);
    setShowForm(false);
  }

  function handleEdit(command: Command) {
    setEditingCommand(command);
    setShowForm(true);
  }

  function handleSave(command: Command) {
    onChange(
      commands.map((c) => (c.commandId === command.commandId ? command : c)),
    );

    setEditingCommand(undefined);
    setShowForm(false);
  }

  function handleDelete(commandId: number) {
    onChange(commands.filter((command) => command.commandId !== commandId));
  }

  function handleCancel() {
    setEditingCommand(undefined);
    setShowForm(false);
  }

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-base font-semibold text-gray-900">Commands</h3>

      {commands.length === 0 && (
        <p className="mb-3 text-sm text-gray-500">No commands yet.</p>
      )}

      <div className="space-y-3">
        {commands.map((command) => (
          <BotCommandItem
            key={command.commandId}
            command={command}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="mt-4">
        {!showForm ? (
          <Button_small
            text="Add Command"
            onClick={() => {
              setEditingCommand(undefined);
              setShowForm(true);
            }}
          />
        ) : (
          <BotCommandForm
            command={editingCommand}
            onSave={editingCommand ? handleSave : handleAdd}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default BotCommands;
