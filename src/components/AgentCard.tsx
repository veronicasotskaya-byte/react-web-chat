import type { Agent } from "../types/Agent";
import "../styles/UserCard.css";
import Avatar from "./Avatar";

type AgentCardProps = {
  agent: Agent;
  onDelete: (id: number) => void;
  onEdit: (agent: Agent) => void;
};

function AgentCard({ agent, onDelete, onEdit }: AgentCardProps) {
  return (
    <div className="user-card">
      <div className="user-header">
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
      </div>

      <p>Email: {agent.email}</p>
      <p>Type: {agent.type}</p>
      <p>Roles: {agent.roles.join(", ")}</p>

      <button type="button" onClick={() => onEdit(agent)}>
        Edit
      </button>

      <button type="button" onClick={() => onDelete(agent.userId)}>
        Delete
      </button>
    </div>
  );
}

export default AgentCard;
