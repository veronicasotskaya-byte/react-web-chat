import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import EditBotForm from "../components/EditBotForm";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { fetchBots } from "../features/bots/botSlice";

function EditBot() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { bots, loading } = useSelector((state: RootState) => state.bots);
  const dispatch = useDispatch<AppDispatch>();

  const isNewBot = !id || id === "new";
  const bot = isNewBot
    ? undefined
    : bots.find((item) => item.botId === Number(id));

  useEffect(() => {
    if (bots.length === 0) {
      void dispatch(fetchBots());
    }
  }, [bots.length, dispatch]);

  if (!isNewBot && (loading || bots.length === 0)) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading bot...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!isNewBot && !bot) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Bot not found.
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  const botToEdit = bot ?? {
    botId: 0,
    username: "",
    name: "",
    description: "",
    webhookUrl: "",
    formattedToken: "",
    avatarUrl: "",
    commands: [],
    welcomeMessages: [],
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {isNewBot ? "Create Bot" : "Edit Bot"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isNewBot
              ? "Create a new bot and configure its commands."
              : "Update this bot details, commands, and welcome messages."}
          </p>
        </div>

        <EditBotForm
          bot={botToEdit}
          onClose={() => {
            navigate("/bots");
          }}
        />
      </div>
    </DashboardLayout>
  );
}

export default EditBot;
