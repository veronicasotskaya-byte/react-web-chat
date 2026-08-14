import type { WelcomeMessage } from "../types/WelcomeMessage";
import Button_small from "./Button_small";

type Props = {
  welcomeMessage: WelcomeMessage;
  onEdit: (message: WelcomeMessage) => void;
  onDelete: (id: number) => void;
};

function WelcomeMessageItem({ welcomeMessage, onEdit, onDelete }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "8px",
      }}
    >
      <strong>{welcomeMessage.message?.text || "Empty message"}</strong>

      <p>Delay: {welcomeMessage.delay} ms</p>

      <p>Typing: {welcomeMessage.typingDuration} ms</p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          width: "fit-content",
        }}
      >
        <Button_small text="Edit" onClick={() => onEdit(welcomeMessage)} />

        <Button_small
          text="Delete"
          onClick={() => onDelete(welcomeMessage.welcomeMessageId)}
        />
      </div>
    </div>
  );
}

export default WelcomeMessageItem;
