import { useState } from "react";
import type { WelcomeMessage } from "../types/WelcomeMessage";

import WelcomeMessageItem from "./WelcomeMessageItem";
import WelcomeMessageForm from "./WelcomeMessageForm";
import Button_small from "./Button_small";

type Props = {
  welcomeMessages: WelcomeMessage[];
  onChange: (messages: WelcomeMessage[]) => void;
};

function WelcomeMessages({ welcomeMessages, onChange }: Props) {
  const [editingMessage, setEditingMessage] = useState<
    WelcomeMessage | undefined
  >(undefined);
  const [showForm, setShowForm] = useState(false);

  function handleAdd(welcomeMessage: WelcomeMessage) {
    onChange([...welcomeMessages, welcomeMessage]);
    setShowForm(false);
  }

  function handleSave(welcomeMessage: WelcomeMessage) {
    onChange(
      welcomeMessages.map((m) =>
        m.welcomeMessageId === welcomeMessage.welcomeMessageId
          ? welcomeMessage
          : m,
      ),
    );

    setEditingMessage(undefined);
    setShowForm(false);
  }

  function handleDelete(messageId: number) {
    onChange(
      welcomeMessages.filter(
        (message) => message.welcomeMessageId !== messageId,
      ),
    );
  }

  function handleEdit(message: WelcomeMessage) {
    setEditingMessage(message);
    setShowForm(true);
  }

  function handleCancel() {
    setEditingMessage(undefined);
    setShowForm(false);
  }

  return (
    <div>
      <h3>Welcome Messages</h3>

      {welcomeMessages.length === 0 && <p>No welcome messages yet.</p>}

      {welcomeMessages.map((message) => (
        <WelcomeMessageItem
          key={message.welcomeMessageId}
          welcomeMessage={message}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      <div
        style={{
          marginTop: "24px",
          marginBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "flex-start",
          width: "fit-content",
        }}
      >
        {!showForm ? (
          <Button_small
            text="Add Welcome Message"
            onClick={() => {
              setEditingMessage(undefined);
              setShowForm(true);
            }}
          />
        ) : (
          <WelcomeMessageForm
            message={editingMessage}
            onSave={editingMessage ? handleSave : handleAdd}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default WelcomeMessages;
