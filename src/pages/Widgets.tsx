import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";
import Input from "../components/Input";
import Button_small from "../components/Button_small";
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
      <h1>Widgets</h1>

      {loading && <p>Loading widgets...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && filteredWidgets.length === 0 && (
        <p>No widgets found.</p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "20px",
          gap: "20px",
        }}
      >
        <Input
          label="Search"
          type="text"
          placeholder="Search widgets..."
          value={search}
          onChange={setSearch}
        />

        <Button_small
          text="Add widget"
          onClick={() => navigate("/widgets/new")}
        />
      </div>

      {!loading && filteredWidgets.length > 0 && (
        <WidgetTable
          widgets={filteredWidgets}
          agentNames={agentNames}
          onEdit={handleEdit}
          onDelete={(widgetId) => {
            void handleDelete(widgetId);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default Widgets;
