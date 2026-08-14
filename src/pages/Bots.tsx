import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";
import BotCard from "../components/BotCard";
import Input from "../components/Input";
import Button from "../components/Button_big";
import BotTable from "../components/BotTable";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";

import type { RootState, AppDispatch } from "../app/store";
import { fetchBots, deleteBotThunk } from "../features/bots/botSlice";

import { useEffect } from "react";

function Bots() {
  const [view, setView] = useState<"cards" | "grid">("cards");

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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
      <h1>Bots</h1>

      {loading && <p>Loading bots...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && filteredBots.length === 0 && (
        <p>No bots yet. Create one to get started.</p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Input
          label="Search"
          type="text"
          placeholder="Search bots..."
          value={search}
          onChange={setSearch}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          <Button text="Create Bot" onClick={() => navigate("/bots/new")} />

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              onClick={() => setView("cards")}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border:
                  view === "cards" ? "2px solid #2563eb" : "1px solid #ccc",
                background: view === "cards" ? "#eff6ff" : "white",
                cursor: "pointer",
              }}
            >
              <BsGrid3X3GapFill />
            </button>

            <button
              onClick={() => setView("grid")}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border:
                  view === "grid" ? "2px solid #2563eb" : "1px solid " + "#ccc",
                background: view === "grid" ? "#eff6ff" : "white",
                cursor: "pointer",
              }}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {view === "cards" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            marginTop: "24px",
          }}
        >
          {filteredBots.map((bot) => (
            <BotCard
              key={bot.botId}
              bot={bot}
              onDelete={handleDeleteBot}
              onEdit={(bot) => navigate(`/bots/${bot.botId}/edit`)}
            />
          ))}
        </div>
      ) : (
        <BotTable
          bots={filteredBots}
          onDelete={handleDeleteBot}
          onEdit={(bot) => navigate(`/bots/${bot.botId}/edit`)}
        />
      )}
    </DashboardLayout>
  );
}

export default Bots;
