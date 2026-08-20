import { useEffect, useState } from "react";

import Input from "./Input";
import Button_big from "./Button_big";
import Button_small from "./Button_small";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import toast from "react-hot-toast";

import {
  getBotTokenThunk,
  regenerateBotTokenThunk,
  saveBotThunk,
} from "../features/bots/botSlice";

import type { Command } from "../types/Command";
import type { Bot, WelcomeMessage } from "../types/Bot";
import BotCommands from "./BotCommands";
import WelcomeMessages from "./WelcomeMessages";

type EditBotFormProps = {
  bot: Bot;
  onClose: () => void;
};

function EditBotForm({ bot, onClose }: EditBotFormProps) {
  const { token } = useSelector((state: RootState) => state.bots);
  const dispatch = useDispatch<AppDispatch>();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [commands, setCommands] = useState<Command[]>([]);
  const [welcomeMessages, setWelcomeMessages] = useState<WelcomeMessage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    setUsername(bot.username);
    setName(bot.name);
    setDescription(bot.description);
    setCommands(bot.commands);
    setWelcomeMessages(bot.welcomeMessages);
  }, [bot]);

  async function handleSave() {
    setNameError("");
    setUsernameError("");
    setError("");

    let hasError = false;

    if (!name.trim()) {
      setNameError("Bot name is required.");
      hasError = true;
    }

    if (!username.trim()) {
      setUsernameError("Username is required.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setSaving(true);

    const botToSave: Bot = {
      botId: bot.botId,
      username,
      name,
      description,
      webhookUrl: bot.webhookUrl ?? "",
      formattedToken: bot.formattedToken ?? "",
      avatarUrl: bot.avatarUrl ?? "",
      commands,
      welcomeMessages,
    };

    try {
      const result = await dispatch(saveBotThunk(botToSave));

      if (saveBotThunk.fulfilled.match(result)) {
        onClose();
        return;
      }

      setError(
        (result.payload as string) ||
          "Failed to save bot. Check the API connection.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleCopyToken() {
    const result = await dispatch(getBotTokenThunk(bot.botId));

    if (getBotTokenThunk.fulfilled.match(result)) {
      const copiedToken = result.payload;

      if (copiedToken) {
        await navigator.clipboard.writeText(copiedToken);
        toast.success("Token copied to clipboard.");
      } else {
        toast.error("No token available.");
      }
    } else {
      toast.error("Failed to load token.");
    }
  }

  async function handleRegenerateToken() {
    const confirmed = window.confirm(
      "Regenerate API token? The old token will stop working.",
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(regenerateBotTokenThunk(bot.botId));

    if (regenerateBotTokenThunk.fulfilled.match(result)) {
      const newToken = result.payload;

      if (newToken) {
        await navigator.clipboard.writeText(newToken);
        toast.success("New token generated and copied.");
      } else {
        toast.error("No token available.");
      }
    } else {
      toast.error("Failed to regenerate token.");
    }
  }

  return (
    <div className="space-y-6">
      {bot.botId > 0 && (
        <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">API Token</p>
            <p className="mt-1 break-all font-mono text-sm text-gray-600">
              {token ?? bot.formattedToken ?? "No token"}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button_small
              text="Copy Token"
              onClick={() => {
                void handleCopyToken();
              }}
            />
            <Button_small
              text="Regenerate Token"
              onClick={() => {
                void handleRegenerateToken();
              }}
            />
          </div>
        </div>
      )}

      <div className="w-full rounded-xl border border-gray-200 bg-white p-6">
        <Input
          label="Bot Name"
          required
          type="text"
          value={name}
          placeholder="Bot name"
          onChange={(value) => {
            setName(value);
            if (nameError) setNameError("");
          }}
          error={nameError}
        />

        <Input
          label="Username"
          required
          type="text"
          value={username}
          placeholder="Telegram username"
          onChange={(value) => {
            setUsername(value);
            if (usernameError) setUsernameError("");
          }}
          error={usernameError}
        />

        <Input
          label="Description"
          type="text"
          value={description}
          placeholder="Description"
          onChange={setDescription}
        />

        <BotCommands commands={commands} onChange={setCommands} />
        <WelcomeMessages
          welcomeMessages={welcomeMessages}
          onChange={setWelcomeMessages}
        />

        {error && (
          <p className="mb-4 text-sm font-medium text-red-600">{error}</p>
        )}

        <div className="mt-6">
          <Button_big
            text={
              saving
                ? "Saving..."
                : bot.botId > 0
                  ? "Save Changes"
                  : "Create Bot"
            }
            onClick={() => {
              void handleSave();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EditBotForm;
