import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";
import BotCard from "../components/BotCard";
import Input from "../components/Input";
import Button_big from "../components/Button_big";
import BotTable from "../components/BotTable";
import EditBotModal from "../components/EditBotModal";
import type { Bot } from "../types/Bot";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";

import type { RootState, AppDispatch } from "../app/store";
import { fetchBots, deleteBotThunk } from "../features/bots/botSlice";

const emptyBot: Bot = {
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

function Bots() {
  const [view, setView] = useState<"cards" | "grid">("cards");
  const [search, setSearch] = useState("");
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const { bots, loading, error } = useSelector(
    (state: RootState) => state.bots,
  );

  useEffect(() => {
    void dispatch(fetchBots());
  }, [dispatch]);

  const searchText = search.trim().toLowerCase();

  const filteredBots = bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchText) ||
      bot.username.toLowerCase().includes(searchText),
  );

  function handleDeleteBot(id: number) {
    void dispatch(deleteBotThunk(id));
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Bots
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your bots and their configuration.
            </p>
          </div>

          <Button_big
            text="+ Create Bot"
            onClick={() => setSelectedBot(emptyBot)}
          />
        </div>

        {/* Search + view switcher */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-xs">
            <Input
              type="text"
              placeholder="Search by name or username..."
              value={search}
              onChange={setSearch}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Card view"
              title="Card view"
              onClick={() => setView("cards")}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                view === "cards"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50",
              ].join(" ")}
            >
              <BsGrid3X3GapFill />
            </button>

            <button
              type="button"
              aria-label="Table view"
              title="Table view"
              onClick={() => setView("grid")}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                view === "grid"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50",
              ].join(" ")}
            >
              <FaList />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">Loading bots...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredBots.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl text-gray-500">🤖</span>
            </div>

            <h2 className="text-base font-semibold text-gray-900">
              {search.trim() ? "No bots found" : "No bots yet"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {search.trim()
                ? "Try a different search term."
                : "Create your first bot to get started."}
            </p>

            {!search.trim() && (
              <div className="mt-5">
                <Button_big
                  text="+ Create Bot"
                  onClick={() => setSelectedBot(emptyBot)}
                />
              </div>
            )}
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filteredBots.length > 0 && view === "cards" && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {filteredBots.map((bot) => (
              <BotCard
                key={bot.botId}
                bot={bot}
                onDelete={handleDeleteBot}
                onEdit={(bot) => setSelectedBot(bot)}
              />
            ))}
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredBots.length > 0 && view === "grid" && (
          <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
            <BotTable
              bots={filteredBots}
              onDelete={handleDeleteBot}
              onEdit={(bot) => setSelectedBot(bot)}
            />
          </div>
        )}

        {selectedBot && (
          <EditBotModal
            bot={selectedBot}
            onClose={() => setSelectedBot(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Bots;
