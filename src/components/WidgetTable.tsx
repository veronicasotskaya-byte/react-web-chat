import type { Widget } from "../types/Widget";
import DataTable from "./DataTable";

type WidgetTableProps = {
  widgets: Widget[];
  agentNames: Map<number, string>;
  onEdit: (widget: Widget) => void;
  onDelete: (widgetId: number) => void;
};

function WidgetTable({
  widgets,
  agentNames,
  onEdit,
  onDelete,
}: WidgetTableProps) {
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (widget: Widget) => (
        <span className="text-sm font-medium text-gray-900">
          {widget.publicWidgetId ? (
            <a
              href={`/widgets/demo/${encodeURIComponent(
                widget.publicWidgetId,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {widget.name}
            </a>
          ) : (
            widget.name
          )}
        </span>
      ),
    },

    {
      key: "enabled",
      header: "Enabled",
      render: (widget: Widget) =>
        widget.enabled ? (
          <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            Enabled
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            Disabled
          </span>
        ),
    },

    {
      key: "agents",
      header: "Agents",
      render: (widget: Widget) => (
        <div className="flex flex-wrap gap-1.5">
          {widget.agents.map((agent) => (
            <span
              key={agent.widgetAgentId}
              className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
            >
              {agentNames.get(agent.agentId) ?? `Agent ${agent.agentId}`}
            </span>
          ))}
        </div>
      ),
    },

    {
      key: "origins",
      header: "Allowed Origins",
      render: (widget: Widget) => (
        <div className="max-w-xs space-y-1 text-sm text-gray-600">
          {widget.allowedOrigins.length > 0
            ? widget.allowedOrigins.map((origin) => (
                <div key={origin} className="truncate" title={origin}>
                  {origin}
                </div>
              ))
            : "None"}
        </div>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      render: (widget: Widget) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(widget)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(widget.widgetId)}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      items={widgets}
      columns={columns}
      getRowKey={(widget) => widget.widgetId}
    />
  );
}

export default WidgetTable;
