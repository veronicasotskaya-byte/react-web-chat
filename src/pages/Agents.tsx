import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";
import AgentCard from "../components/AgentCard";
import Input from "../components/Input";
import Button from "../components/Button_big";
import AgentTable from "../components/AgentTable";

import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";

import type { Agent } from "../types/Agent";
import type { RootState, AppDispatch } from "../app/store";

import {
  fetchAgents,
  deleteAgentThunk,
} from "../features/agents/agentSlice";

function Agents() {
  const [view, setView] = useState<"cards" | "grid">("cards");
  const [sortBy, setSortBy] = useState<"id" | "name" | "email">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const dispatch = useDispatch<AppDispatch>();

  const { agents, loading, error } = useSelector(
    (state: RootState) => state.agents,
  );

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 6;
  const agentsAndBots = useSelector(
    (state: RootState) => state.agents.agentsAndBots,
  );
  console.log("Agents and bots:", agentsAndBots);

  useEffect(() => {
    void dispatch(fetchAgents());
  }, [dispatch]);

  function handleEditAgent(agent: Agent) {
    navigate(`/agents/${agent.userId}/edit`);
  }

  function handleSort(column: "id" | "name" | "email") {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }

  function handleDeleteAgent(id: number) {
    void dispatch(deleteAgentThunk(id));
  }

  const searchText = search.trim().toLowerCase();

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchText) ||
      agent.email.toLowerCase().includes(searchText),
  );

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    let result = 0;

    if (sortBy === "id") {
      result = a.userId - b.userId;
    }

    if (sortBy === "name") {
      result = a.name.localeCompare(b.name);
    }

    if (sortBy === "email") {
      result = a.email.localeCompare(b.email);
    }

    return sortDirection === "asc" ? result : -result;
  });

  const startIndex = (currentPage - 1) * agentsPerPage;
  const endIndex = startIndex + agentsPerPage;

  const paginatedAgents = sortedAgents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedAgents.length / agentsPerPage);

  return (
    <DashboardLayout>
      <h1>Agents</h1>

      {loading && <p>Loading agents...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
          placeholder="Search agents..."
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
          <Button text="Add Agent" onClick={() => navigate(`/agents/new`)} />

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
          {paginatedAgents.map((agent) => (
            <AgentCard
              key={agent.userId}
              agent={agent}
              onDelete={handleDeleteAgent}
              onEdit={handleEditAgent}
            />
          ))}
        </div>
      ) : (
        <AgentTable
          agents={paginatedAgents}
          onDelete={handleDeleteAgent}
          onEdit={handleEditAgent}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}
      <div
        style={{
          paddingBottom: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          marginTop: "24px",
        }}
      >
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              fontWeight: currentPage === index + 1 ? "bold" : "normal",
            }}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </DashboardLayout>
  );
}

export default Agents;
