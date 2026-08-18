import type { Agent } from "../types/Agent";
import Avatar from "./Avatar";
import DataTable from "./DataTable";
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
  const getSortIcon = (column: "id" | "name" | "email") => {
    if (sortBy !== column) {
      return null;
    }

    return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const columns = [
    {
      key: "id",
      header: (
        <button
          type="button"
          onClick={() => onSort("id")}
          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
        >
          ID
          {getSortIcon("id")}
        </button>
      ),

      render: (agent: Agent) => (
        <span className="text-sm text-gray-600">{agent.userId}</span>
      ),
    },

    {
      key: "name",
      header: (
        <button
          type="button"
          onClick={() => onSort("name")}
          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
        >
          Name
          {getSortIcon("name")}
        </button>
      ),

      render: (agent: Agent) => (
        <div className="flex items-center gap-3">
          <Avatar name={agent.name} id={agent.userId} />

          <span className="text-sm font-medium text-gray-900">
            {agent.name}
          </span>
        </div>
      ),
    },

    {
      key: "email",
      header: (
        <button
          type="button"
          onClick={() => onSort("email")}
          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
        >
          Email
          {getSortIcon("email")}
        </button>
      ),

      render: (agent: Agent) => (
        <span className="text-sm text-gray-600">{agent.email}</span>
      ),
    },

    {
      key: "type",
      header: "Type",

      render: (agent: Agent) => (
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
          {agent.type}
        </span>
      ),
    },

    {
      key: "actions",
      header: "Actions",

      render: (agent: Agent) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(agent)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(agent.userId)}
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
      items={agents}
      columns={columns}
      getRowKey={(agent) => agent.userId}
    />
  );
}

export default AgentTable;
