import DashboardLayout from "../layouts/DashboardLayout";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../app/store";
import { fetchBots } from "../features/bots/botSlice";
import { fetchAgents } from "../features/agents/agentSlice";
import { fetchWidgets } from "../features/widgets/widgetsSlice";
import { fetchChats } from "../features/chat/chatsSlice";

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const bots = useSelector((state: RootState) => state.bots.bots);
  const agents = useSelector((state: RootState) => state.agents.agents);
  const widgets = useSelector((state: RootState) => state.widgets.widgets);
  const chats = useSelector((state: RootState) => state.chats.chats);

  useEffect(() => {
    void dispatch(fetchBots());
    void dispatch(fetchAgents());
    void dispatch(fetchWidgets());
    void dispatch(fetchChats());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">Welcome to bot builder.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => navigate("/bots")}
            className="rounded-xl border border-gray-200 bg-white p-5 text-left transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">Bots</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              {bots.length}
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/agents")}
            className="rounded-xl border border-gray-200 bg-white p-5 text-left transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">Agents</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              {agents.length}
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/widgets")}
            className="rounded-xl border border-gray-200 bg-white p-5 text-left transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">Widgets</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              {widgets.length}
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/chats")}
            className="rounded-xl border border-gray-200 bg-white p-5 text-left transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">Chats</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              {chats.length}
            </p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
