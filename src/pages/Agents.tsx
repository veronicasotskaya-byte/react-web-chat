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

import { fetchAgents, deleteAgentThunk } from "../features/agents/agentSlice";

function Agents() {
  const [view, setView] = useState<"cards" | "grid">("cards");

  const [sortBy, setSortBy] = useState<"id" | "name" | "email">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const agentsPerPage = 6;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { agents, loading, error } = useSelector(
    (state: RootState) => state.agents,
  );

  useEffect(() => {
    void dispatch(fetchAgents());
  }, [dispatch]);

  function handleEditAgent(agent: Agent) {
    navigate(`/agents/${agent.userId}/edit`);
  }

  function handleSort(column: "id" | "name" | "email") {
    if (sortBy === column) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
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

  const totalPages = Math.ceil(sortedAgents.length / agentsPerPage);

  const startIndex = (currentPage - 1) * agentsPerPage;

  const paginatedAgents = sortedAgents.slice(
    startIndex,
    startIndex + agentsPerPage,
  );

  // Reset to page 1 if the current page becomes invalid
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Return to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Agents
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your agents and their availability.
            </p>
          </div>

          <Button
            text="+ Add agent"
            onClick={() => navigate("/agents/new")}
            className="w-full sm:w-auto"
          />
        </div>

        {/* Search + view controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-xs">
            <Input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={setSearch}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("cards")}
              aria-label="Card view"
              className={[
                "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                view === "cards"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50",
              ].join(" ")}
            >
              <BsGrid3X3GapFill />
            </button>

            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Table view"
              className={[
                "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                view === "grid"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
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
            <p className="text-sm text-gray-500">Loading agents...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredAgents.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl text-gray-500">◉</span>
            </div>

            <h2 className="text-base font-semibold text-gray-900">
              {search.trim() ? "No agents found" : "No agents yet"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {search.trim()
                ? "Try a different search term."
                : "Create your first agent to get started."}
            </p>

            {!search.trim() && (
              <div className="mt-5">
                <Button
                  text="+ Add agent"
                  onClick={() => navigate("/agents/new")}
                />
              </div>
            )}
          </div>
        )}

        {/* Agents */}
        {!loading && !error && paginatedAgents.length > 0 && (
          <>
            {view === "cards" ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
              <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white">
                <AgentTable
                  agents={paginatedAgents}
                  onDelete={handleDeleteAgent}
                  onEdit={handleEditAgent}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={[
                    "h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition-colors",
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Agents;
