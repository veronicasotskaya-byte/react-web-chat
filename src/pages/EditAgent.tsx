import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import Input from "../components/Input";
import Button from "../components/Button_big";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";

import {
  createAgentThunk,
  fetchAgents,
  updateAgentThunk,
} from "../features/agents/agentSlice";
import type { Agent } from "../types/Agent";

function EditAgent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const agents = useSelector((state: RootState) => state.agents.agents);
  const loading = useSelector((state: RootState) => state.agents.loading);

  const dispatch = useDispatch<AppDispatch>();

  const isNewAgent = !id || id === "new";
  const agent = isNewAgent
    ? undefined
    : agents.find((item) => item.userId === Number(id));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (agents.length === 0) {
      void dispatch(fetchAgents());
    }
  }, [agents.length, dispatch]);

  useEffect(() => {
    if (!agent) {
      return;
    }

    setName(agent.name);
    setEmail(agent.email);
  }, [agent]);

  async function handleSave() {
    setNameError("");
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!name.trim()) {
      setNameError("Agent name is required.");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required.");
      hasError = true;
    }

    if (isNewAgent && !password.trim()) {
      setPasswordError("Password is required.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setSaving(true);

    try {
      if (isNewAgent) {
        const newAgent: Agent = {
          username: email.trim(),
          name: name.trim(),
          email: email.trim(),
          avatarUrl: "",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          userId: 0,
          externalUserId: "",
          type: "Agent",
          password,
          roles: ["Agent"],
        };

        await dispatch(createAgentThunk(newAgent)).unwrap();
        toast.success("Agent created.");
        navigate("/agents");
        return;
      }

      if (!agent) {
        return;
      }

      await dispatch(
        updateAgentThunk({
          ...agent,
          name: name.trim(),
          email: email.trim(),
          username: email.trim(),
          password: password || agent.password,
        }),
      ).unwrap();

      toast.success("Agent updated.");
      navigate("/agents");
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to save agent.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (!isNewAgent && loading && !agent) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading agent...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!isNewAgent && !agent && !loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Agent not found.
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {isNewAgent ? "Create Agent" : "Edit Agent"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isNewAgent
              ? "Create a new agent and set their login details."
              : "Update this agent's name, email, and password."}
          </p>
        </div>

        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 lg:w-1/2">
          <Input
            label="Agent Name"
            type="text"
            value={name}
            placeholder="Agent name"
            onChange={setName}
            required
            error={nameError}
          />

          <Input
            label="Email"
            type="email"
            value={email}
            placeholder="Email"
            onChange={setEmail}
            required
            error={emailError}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            placeholder={isNewAgent ? "Password" : "Leave blank to keep current"}
            onChange={setPassword}
            required={isNewAgent}
            error={passwordError}
          />

          <div className="mt-6">
            <Button
              text={
                saving
                  ? "Saving..."
                  : isNewAgent
                    ? "Create Agent"
                    : "Save Changes"
              }
              onClick={() => {
                if (!saving) {
                  void handleSave();
                }
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditAgent;
