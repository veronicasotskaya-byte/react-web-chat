import type { Agent } from "../types/Agent";
import type { AuthResult } from "../types/AuthResult";
import { withTenant } from "./withTenant";

function authErrorMessage(errorCode: AuthResult["errorCode"]) {
  switch (errorCode) {
    case "EmailBusy":
      return "An agent with this email already exists.";
    case "UsernameBusy":
      return "An agent with this username already exists.";
    case "VerificationFailed":
      return "Agent verification failed.";
    default:
      return "Failed to save agent";
  }
}

export async function getAgents(tenantId?: string | null): Promise<Agent[]> {
  const response = await fetch(withTenant("/api/Agent", tenantId), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load agents");
  }

  return response.json();
}

export async function createAgent(
  agent: Agent,
  tenantId?: string | null,
): Promise<AuthResult> {
  const response = await fetch(withTenant("/api/Users/agent", tenantId), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agent),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `Failed to save agent (${response.status})${details ? `: ${details}` : ""}`,
    );
  }

  const result = (await response.json()) as AuthResult;

  if (!result.succeeded) {
    throw new Error(authErrorMessage(result.errorCode));
  }

  return result;
}

export async function getAgentsAndBots(tenantId?: string | null) {
  const response = await fetch(withTenant("/api/Agent/and-bots", tenantId), {
   method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load agents and bots");
  }

  return response.json();
}

export async function updateAgent(agent: Agent, tenantId?: string | null) {
  const response = await fetch(withTenant("/api/Users/agent", tenantId), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agent),
  });

  if (!response.ok) {
    throw new Error("Failed to save agent");
  }

  return true;
}

export async function deleteAgent(agentId: number, tenantId?: string | null) {
  if (agentId == null || Number.isNaN(Number(agentId))) {
    throw new Error("Failed to delete agent: missing agentId");
  }

  const response = await fetch(withTenant(`/api/Agent/${agentId}`, tenantId), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `Failed to delete agent (${response.status})${details ? `: ${details}` : ""}`,
    );
  }

  // API may return boolean JSON, empty body, or 204
  const text = await response.text();
  if (!text) {
    return true;
  }

  try {
    return JSON.parse(text) as boolean;
  } catch {
    return true;
  }
}
