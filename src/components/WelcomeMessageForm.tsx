import { useEffect, useState } from "react";
import type { WelcomeMessage } from "../types/WelcomeMessage";
import Input from "./Input";
import Button_small from "./Button_small";

type Props = {
  message?: WelcomeMessage;
  onSave: (message: WelcomeMessage) => void;
  onCancel?: () => void;
};

function WelcomeMessageForm({ message, onSave, onCancel }: Props) {
  const [text, setText] = useState("");
  const [delay, setDelay] = useState("0");
  const [typingDuration, setTypingDuration] = useState("0");

  useEffect(() => {
    setText(message?.message?.text ?? "");
    setDelay(String(message?.delay ?? 0));
    setTypingDuration(String(message?.typingDuration ?? 0));
  }, [message]);

  function handleSubmit() {
    onSave({
      welcomeMessageId: message?.welcomeMessageId ?? 0,
      message: {
        senderId: message?.message?.senderId ?? 0,
        messageId: message?.message?.messageId ?? 0,
        replyToMessageId: message?.message?.replyToMessageId ?? 0,
        text,
        imageId: message?.message?.imageId ?? 0,
        buttons: message?.message?.buttons ?? [],
        format: message?.message?.format ?? "Raw",
        timestamp: message?.message?.timestamp ?? new Date().toISOString(),
        imagePath: message?.message?.imagePath ?? "",
        imageUrl: message?.message?.imageUrl ?? "",
      },
      delay: Number(delay),
      typingDuration: Number(typingDuration),
      externalId: message?.externalId ?? "",
    });

    if (!message) {
      setText("");
      setDelay("0");
      setTypingDuration("0");
    }
  }

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "flex-start",
        width: "fit-content",
        alignSelf: "flex-start",
      }}
    >
      <Input
        label="Message"
        type="text"
        value={text}
        placeholder="Welcome message text"
        onChange={setText}
      />

      <Input
        label="Delay (ms)"
        type="number"
        value={delay}
        placeholder="0"
        onChange={setDelay}
      />

      <Input
        label="Typing Duration (ms)"
        type="number"
        value={typingDuration}
        placeholder="0"
        onChange={setTypingDuration}
      />

      <div style={{ display: "flex", gap: "8px" }}>
        <Button_small
          text={message ? "Save Changes" : "Add Welcome Message"}
          onClick={handleSubmit}
        />

        {onCancel && <Button_small text="Cancel" onClick={onCancel} />}
      </div>
    </div>
  );
}

export default WelcomeMessageForm;
