import type { Agent } from "../types/Agent";
import Avatar from "./Avatar";

type AgentCardProps = {
  agent: Agent;
  onDelete: (id: number) => void;
  onEdit: (agent: Agent) => void;
};

function AgentCard({ agent, onDelete, onEdit }: AgentCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={agent.name} id={agent.userId} />

          <span className="text-base font-semibold text-gray-900">
            {agent.name}
          </span>
        </div>
      </div>

      {/* Agent information */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Email:</span>{" "}
          {agent.email}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Type:</span> {agent.type}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Roles:</span>{" "}
          {agent.roles.join(", ")}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2 border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(agent)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(agent.userId)}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default AgentCard;
