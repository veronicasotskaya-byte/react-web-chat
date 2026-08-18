import type { WelcomeMessage } from "../types/WelcomeMessage";
import Button_small from "./Button_small";

type Props = {
  welcomeMessage: WelcomeMessage;
  onEdit: (message: WelcomeMessage) => void;
  onDelete: (id: number) => void;
};

function WelcomeMessageItem({ welcomeMessage, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold text-gray-900">
        {welcomeMessage.message?.text || "Empty message"}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Delay: {welcomeMessage.delay} ms
      </p>

      <p className="text-sm text-gray-600">
        Typing: {welcomeMessage.typingDuration} ms
      </p>

      <div className="mt-3 flex gap-2">
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
