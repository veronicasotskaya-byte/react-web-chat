import { Dialog } from "radix-ui";
import type { Bot } from "../types/Bot";
import EditBotForm from "./EditBotForm";

type EditBotModalProps = {
  bot: Bot;
  onClose: () => void;
};

function EditBotModal({ bot, onClose }: EditBotModalProps) {
  return (
    <Dialog.Root
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              {bot.botId > 0 ? "Edit Bot" : "Create Bot"}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          <EditBotForm bot={bot} onClose={onClose} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditBotModal;
