import type { Agent } from "../types/Agent";
import Avatar from "./Avatar";
import { FaSortUp, FaSortDown } from "react-icons/fa";

type AgentTableProps = {
  agents: Agent[];
  onDelete: (id: number) => void;
  onEdit: (agent: Agent) => void;

  sortBy: "id" | "name" | "email";
  sortDirection: "asc" | "desc";
  onSort: (column: "id" | "name" | "email") => void;
};

function AgentTable({
  agents,
  onDelete,
  onEdit,
  sortBy,
  sortDirection,
  onSort,
}: AgentTableProps) {
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
          <th
            style={{ ...headerStyle, cursor: "pointer" }}
            onClick={() => onSort("id")}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ID
              {sortBy === "id" &&
                (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
            </span>
          </th>

          <th
            style={{ ...headerStyle, cursor: "pointer" }}
            onClick={() => onSort("name")}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Name{" "}
              {sortBy === "name" &&
                (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
            </span>
          </th>

          <th
            style={{ ...headerStyle, cursor: "pointer" }}
            onClick={() => onSort("email")}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Email{" "}
              {sortBy === "email" &&
                (sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />)}
            </span>
          </th>

          <th style={headerStyle}>Type</th>
          <th style={headerStyle}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {agents.map((agent) => (
          <tr key={agent.userId}>
            <td style={cellStyle}>{agent.userId}</td>
            <td style={cellStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Avatar name={agent.name} id={agent.userId} />

                <span>{agent.name}</span>
              </div>
            </td>
            <td style={cellStyle}>{agent.email}</td>

            <td style={cellStyle}>{agent.type}</td>

            <td style={cellStyle}>
              <button
                onClick={() => onEdit(agent)}
                style={{ marginRight: "8px" }}
              >
                Edit
              </button>

              <button onClick={() => onDelete(agent.userId)}>Delete</button>
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

export default AgentTable;
