import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";
import Input from "../components/Input";
import Button_big from "../components/Button_big";
import WidgetTable from "../components/WidgetTable";

import type { RootState, AppDispatch } from "../app/store";
import type { Widget } from "../types/Widget";

import {
  fetchWidgets,
  deleteWidgetThunk,
} from "../features/widgets/widgetsSlice";

import { fetchAgentsAndBots } from "../features/agents/agentSlice";

function Widgets() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { widgets, loading, error } = useSelector(
    (state: RootState) => state.widgets,
  );

  const agentsAndBots = useSelector(
    (state: RootState) => state.agents.agentsAndBots,
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    void dispatch(fetchWidgets());
    void dispatch(fetchAgentsAndBots());
  }, [dispatch]);

  const agentNames = useMemo(() => {
    const map = new Map<number, string>();

    for (const item of agentsAndBots) {
      if ("userId" in item && item.userId != null) {
        map.set(item.userId, item.name);
      }
    }

    return map;
  }, [agentsAndBots]);

  const filteredWidgets = widgets.filter((widget) =>
    widget.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function handleEdit(widget: Widget) {
    navigate(`/widgets/${widget.widgetId}/edit`);
  }

  async function handleDelete(widgetId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this widget?",
    );

    if (!confirmed) {
      return;
    }

    await dispatch(deleteWidgetThunk(widgetId));
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Widgets
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your web chat widgets and their configuration.
            </p>
          </div>

          <Button_big
            text="+ Add widget"
            onClick={() => navigate("/widgets/new")}
          />
        </div>

        {/* Search */}

        <div className="max-w-xs">
          <Input
            type="text"
            placeholder="Search by widget name..."
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="text-sm text-gray-500">Loading widgets...</div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredWidgets.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl text-gray-500">◉</span>
            </div>

            <h2 className="text-base font-semibold text-gray-900">
              {search.trim() ? "No widgets found" : "No widgets yet"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {search.trim()
                ? "Try a different search term."
                : "Create your first widget to get started."}
            </p>

            {!search.trim() && (
              <div className="mt-5">
                <Button_big
                  text="+ Add widget"
                  onClick={() => navigate("/widgets/new")}
                />
              </div>
            )}
          </div>
        )}

        {/* Widget table */}
        {!loading && !error && filteredWidgets.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
            <WidgetTable
              widgets={filteredWidgets}
              agentNames={agentNames}
              onEdit={handleEdit}
              onDelete={(widgetId) => {
                void handleDelete(widgetId);
              }}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Widgets;
