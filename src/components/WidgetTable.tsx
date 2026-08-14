import type { Widget } from "../types/Widget";

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
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "24px",
      }}
    >
      <thead>
        <tr>
          <th style={headerStyle}>Name</th>
          <th style={headerStyle}>Enabled</th>
          <th style={headerStyle}>Agents</th>
          <th style={headerStyle}>Allowed Origins</th>
          <th style={headerStyle}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {widgets.map((widget) => (
          <tr key={widget.widgetId}>
            <td style={cellStyle}>
              {widget.publicWidgetId ? (
                <a
                  href={`/widgets/demo/${encodeURIComponent(widget.publicWidgetId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {widget.name}
                </a>
              ) : (
                widget.name
              )}
            </td>

            <td style={cellStyle}>{widget.enabled ? "Yes" : "No"}</td>

            <td style={cellStyle}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                {widget.agents
                  .slice()
                  .sort((a, b) => a.priority - b.priority)
                  .map((widgetAgent) => {
                    const name =
                      agentNames.get(widgetAgent.agentId) ??
                      `Agent ${widgetAgent.agentId}`;

                    return (
                      <span
                        key={widgetAgent.widgetAgentId}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          background: "#f1f5f9",
                          fontSize: "13px",
                        }}
                      >
                        {name}
                      </span>
                    );
                  })}
              </div>
            </td>

            <td style={cellStyle}>{widget.allowedOrigins.join(", ")}</td>

            <td style={cellStyle}>
              <button
                type="button"
                onClick={() => onEdit(widget)}
                style={{ marginRight: "8px" }}
              >
                Edit
              </button>

              <button type="button" onClick={() => onDelete(widget.widgetId)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const headerStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left" as const,
  backgroundColor: "#f4f4f4",
};

const cellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

export default WidgetTable;
