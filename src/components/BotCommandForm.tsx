import { useEffect, useState } from "react";

import type { Command } from "../types/Command";

import Input from "./Input";
import Button_small from "./Button_small";

type Props = {
  command?: Command;
  onSave: (command: Command) => void;
  onCancel?: () => void;
};

function BotCommandForm({ command, onSave, onCancel }: Props) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setText(command?.text ?? "");
    setDescription(command?.description ?? "");
  }, [command]);

  function handleSubmit() {
    onSave({
      commandId: command?.commandId ?? 0,
      text,
      description,
    });

    if (!command) {
      setText("");
      setDescription("");
    }
  }

  return (
    <div className="mt-4 w-full max-w-xl space-y-1 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <Input
        label="Command"
        type="text"
        value={text}
        placeholder="e.g. start"
        onChange={setText}
      />

      <Input
        label="Description"
        type="text"
        value={description}
        placeholder="What this command does"
        onChange={setDescription}
      />

      <div className="flex gap-2">
        <Button_small
          text={command ? "Save Changes" : "Add Command"}
          onClick={handleSubmit}
        />
        {onCancel && <Button_small text="Cancel" onClick={onCancel} />}
      </div>
    </div>
  );
}

export default BotCommandForm;
