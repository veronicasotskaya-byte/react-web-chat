import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import Input from "../components/Input";
import Button_big from "../components/Button_big";
import Button_small from "../components/Button_small";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import toast from "react-hot-toast";

import {
  fetchBots,
  saveBotThunk,
  getBotTokenThunk,
  regenerateBotTokenThunk,
} from "../features/bots/botSlice";

import type { Command } from "../types/Command";
import type { Bot, WelcomeMessage } from "../types/Bot";
import BotCommands from "../components/BotCommands";
import WelcomeMessages from "../components/WelcomeMessages";

function EditBot() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { bots, loading, token } = useSelector(
    (state: RootState) => state.bots,
  );

  const dispatch = useDispatch<AppDispatch>();

  const isNewBot = !id || id === "new";
  const bot = isNewBot
    ? undefined
    : bots.find((item) => item.botId === Number(id));

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
    if (!bot) {
      return;
    }

    setUsername(bot.username);
    setName(bot.name);
    setDescription(bot.description);
    setCommands(bot.commands);
    setWelcomeMessages(bot.welcomeMessages);
  }, [bot]);

  useEffect(() => {
    if (bots.length === 0) {
      void dispatch(fetchBots());
    }
  }, [bots.length, dispatch]);

  async function handleSave() {
    setNameError("");
    setUsernameError("");

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
      setSaving(false);
      return;
    }

    const botToSave: Bot = {
      botId: bot?.botId ?? 0,
      username,
      name,
      description,
      webhookUrl: bot?.webhookUrl ?? "",
      formattedToken: bot?.formattedToken ?? "",
      avatarUrl: bot?.avatarUrl ?? "",
      commands,
      welcomeMessages,
    };

    try {
      console.log("Bot being sent to API:", botToSave);

      const result = await dispatch(saveBotThunk(botToSave));

      if (saveBotThunk.fulfilled.match(result)) {
        navigate("/bots");
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

  if (!isNewBot && (loading || bots.length === 0)) {
    return (
      <DashboardLayout>
        <h2>Loading bot...</h2>
      </DashboardLayout>
    );
  }

  if (!isNewBot && !bot) {
    return (
      <DashboardLayout>
        <h2>Bot not found.</h2>
      </DashboardLayout>
    );
  }

  async function handleCopyToken() {
    if (!bot) return;

    const result = await dispatch(getBotTokenThunk(bot.botId));

    if (getBotTokenThunk.fulfilled.match(result)) {
      const token = result.payload;

      if (token) {
        await navigator.clipboard.writeText(token);
        toast.success("Token copied to clipboard.");
      } else {
        toast.error("No token available.");
      }
    } else {
      toast.error("Failed to load token.");
    }
  }

  async function handleRegenerateToken() {
    if (!bot) return;

    const confirmed = window.confirm(
      "Regenerate API token? The old token will stop working.",
    );

    if (!confirmed) return;

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
    <DashboardLayout>
      <div>
        <h1>{isNewBot ? "Create Bot" : "Edit Bot"}</h1>

        {!isNewBot && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                flex: 1,
                overflow: "hidden",
              }}
            >
              <strong>API Token:</strong>{" "}
              <span
                style={{
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {token ?? bot?.formattedToken ?? "No token"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "10px",
              }}
            >
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
                style={{ minWidth: "170px" }}
              />
            </div>
          </div>
        )}

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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button_big
          text={saving ? "Saving..." : isNewBot ? "Create Bot" : "Save Changes"}
          onClick={() => {
            void handleSave();
          }}
        />
      </div>
    </DashboardLayout>
  );
}

export default EditBot;
