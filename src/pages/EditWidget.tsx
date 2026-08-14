import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import Input from "../components/Input";
import Button from "../components/Button_big";
import Button_small from "../components/Button_small";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";

import {
  fetchWidgets,
  saveWidgetThunk,
  rotatePublicWidgetIdThunk,
} from "../features/widgets/widgetsSlice";

import { fetchAgentsAndBots } from "../features/agents/agentSlice";

import type { Widget, WidgetAgent } from "../types/Widget";

function normalizeOrigin(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const url = new URL(trimmed);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Allowed origins must use http:// or https://.");
  }

  return url.origin;
}

function EditWidget() {
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const { widgets, loading } = useSelector((state: RootState) => state.widgets);
  const tenantId = useSelector((state: RootState) => state.auth.tenantId);

  const agentsAndBots = useSelector(
    (state: RootState) => state.agents.agentsAndBots,
  );

  const isNewWidget = !id || id === "new";

  const widget = isNewWidget
    ? undefined
    : widgets.find((item) => item.widgetId === Number(id));

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [standAlonePublic, setStandAlonePublic] = useState(true);

  const [nameError, setNameError] = useState("");

  const [allowedOrigins, setAllowedOrigins] = useState<string[]>([]);
  const [allowedOriginsError, setAllowedOriginsError] = useState("");

  const [widgetAgents, setWidgetAgents] = useState<WidgetAgent[]>([]);

  const [saving, setSaving] = useState(false);

  /*
   * Load widgets.
   */
  useEffect(() => {
    if (widgets.length === 0) {
      void dispatch(fetchWidgets());
    }
  }, [widgets.length, dispatch]);

  /*
   * Load agents and bots.
   */
  useEffect(() => {
    void dispatch(fetchAgentsAndBots());
  }, [dispatch]);

  /*
   * Populate the form when editing an existing widget.
   */
  useEffect(() => {
    if (!widget) {
      if (isNewWidget) {
        setWidgetAgents([]);
        setAllowedOrigins([]);
      }

      return;
    }

    setName(widget.name);
    setAvatarUrl(widget.avatarUrl ?? "");
    setEnabled(widget.enabled);
    setStandAlonePublic(widget.standAlonePublic);

    setAllowedOrigins(widget.allowedOrigins ?? []);

    setWidgetAgents(
      [...(widget.agents ?? [])].sort((a, b) => a.priority - b.priority),
    );
  }, [widget, isNewWidget]);

  /*
   * Save widget.
   */
  async function handleSave() {
    setNameError("");
    setAllowedOriginsError("");

    if (!name.trim()) {
      setNameError("Widget name is required.");
      return;
    }

    if (!widget?.tenantId && !tenantId) {
      toast.error("Tenant ID is missing. Please sign in again.");
      return;
    }

    /*
     * Normalize and validate all origins before saving.
     *
     * Example:
     * https://example.com/some/path
     *
     * becomes:
     * https://example.com
     */
    const normalizedOrigins: string[] = [];

    try {
      for (const origin of allowedOrigins) {
        if (!origin.trim()) {
          continue;
        }

        normalizedOrigins.push(normalizeOrigin(origin));
      }
    } catch {
      setAllowedOriginsError(
        "Please enter valid origins, for example https://example.com.",
      );
      return;
    }

    /*
     * Recalculate priorities from the current array order.
     */
    const normalizedAgents: WidgetAgent[] = widgetAgents.map(
      (agent, index) => ({
        ...agent,
        priority: index + 1,
      }),
    );

    setSaving(true);

    try {
      const widgetToSave: Widget = {
        /*
         * Preserve existing widget values when editing.
         */
        ...(widget ?? {
          widgetId: 0,
          publicWidgetId: null,
          agents: [],
          allowedOrigins: [],
          verifyExternalId: null,
        }),

        widgetId: widget?.widgetId ?? 0,

        /*
         * API requires a Guid — never send null.
         */
        tenantId: widget?.tenantId || tenantId,

        name: name.trim(),

        /*
         * Avatar URL is optional.
         */
        avatarUrl: avatarUrl.trim() || "",

        enabled,

        standAlonePublic,

        /*
         * Save the current agents.
         */
        agents: normalizedAgents,

        /*
         * Save normalized origins.
         */
        allowedOrigins: normalizedOrigins,

        /*
         * VerifyExternalId is intentionally preserved.
         *
         * For a new widget it is null.
         */
        verifyExternalId: widget?.verifyExternalId ?? null,
      };

      console.log("Saving widget:", widgetToSave);

      await dispatch(saveWidgetThunk(widgetToSave)).unwrap();

      toast.success(isNewWidget ? "Widget created." : "Widget updated.");

      navigate("/widgets");
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to save widget.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  /*
   * Add the first available agent/bot.
   *
   * Since you currently only want one assigned agent,
   * this prevents adding another one.
   */
  function addWidgetAgent() {
    if (widgetAgents.length >= 1) {
      toast.error("Only one agent can be assigned to a widget.");
      return;
    }

    const availableAgent = agentsAndBots.find(
      (item) =>
        "userId" in item &&
        item.userId != null &&
        !widgetAgents.some((agent) => agent.agentId === item.userId),
    );

    if (!availableAgent || !("userId" in availableAgent)) {
      toast.error("No available agents or bots.");
      return;
    }

    setWidgetAgents([
      {
        widgetAgentId: 0,
        agentId: availableAgent.userId,
        action: "Assign",
        priority: 1,
        enabled: true,
      },
    ]);
  }

  /*
   * Update the assigned agent.
   */
  function updateWidgetAgent(index: number, changes: Partial<WidgetAgent>) {
    setWidgetAgents((current) =>
      current.map((agent, i) =>
        i === index
          ? {
              ...agent,
              ...changes,
            }
          : agent,
      ),
    );
  }

  /*
   * Remove the assigned agent.
   */
  function removeWidgetAgent(index: number) {
    setWidgetAgents((current) =>
      current
        .filter((_, i) => i !== index)
        .map((agent, i) => ({
          ...agent,
          priority: i + 1,
        })),
    );
  }

  /*
   * Rotate public widget ID.
   */
  async function handleRotatePublicId() {
    if (!widget) {
      return;
    }

    const confirmed = window.confirm(
      "Rotating the public ID will invalidate every deployed embed snippet. Are you sure you want to continue?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(rotatePublicWidgetIdThunk(widget.widgetId)).unwrap();

      toast.success("Public widget ID rotated.");
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to rotate public widget ID.";

      toast.error(message);
    }
  }

  /*
   * Loading state.
   */
  if (!isNewWidget && loading && !widget) {
    return (
      <DashboardLayout>
        <h2>Loading widget...</h2>
      </DashboardLayout>
    );
  }

  /*
   * Not found.
   */
  if (!isNewWidget && !widget) {
    return (
      <DashboardLayout>
        <h2>Widget not found.</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h1>{isNewWidget ? "Create Widget" : "Edit Widget"}</h1>

        {/* Widget Name */}

        <Input
          label="Widget Name"
          type="text"
          value={name}
          placeholder="Widget name"
          onChange={setName}
          required
          error={nameError}
        />

        {/* Avatar URL */}

        <Input
          label="Avatar URL"
          type="text"
          value={avatarUrl}
          placeholder="Avatar URL"
          onChange={setAvatarUrl}
        />

        {/* Enabled */}

        <div
          style={{
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />

            <span>Enabled</span>
          </label>
        </div>

        {/* Standalone Public */}

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={standAlonePublic}
              onChange={(event) => setStandAlonePublic(event.target.checked)}
            />

            <span>Standalone Public</span>
          </label>
        </div>

        {/* Agents */}

        <div
          style={{
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <h3>Agents</h3>

          {widgetAgents.length === 0 && (
            <p style={{ color: "#666" }}>
              No agent or bot assigned to this widget.
            </p>
          )}

          {widgetAgents.map((widgetAgent, index) => (
            <div
              key={`${widgetAgent.widgetAgentId}-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              {/* Priority */}

              <span
                style={{
                  width: "25px",
                  fontWeight: "bold",
                }}
              >
                {index + 1}.
              </span>

              {/* Agent / Bot */}

              <select
                value={widgetAgent.agentId}
                onChange={(event) =>
                  updateWidgetAgent(index, {
                    agentId: Number(event.target.value),
                  })
                }
                style={{
                  flex: 1,
                  padding: "8px",
                }}
              >
                {agentsAndBots
                  .filter((item) => "userId" in item && item.userId != null)
                  .map((item) => (
                    <option key={item.userId} value={item.userId}>
                      {item.name}
                    </option>
                  ))}
              </select>

              {/* Action */}

              <select
                value={widgetAgent.action}
                onChange={(event) =>
                  updateWidgetAgent(index, {
                    action: event.target.value as "Assign" | "Notify",
                  })
                }
                style={{
                  padding: "8px",
                }}
              >
                <option value="Assign">Assign</option>
                <option value="Notify">Notify</option>
              </select>

              {/* Enabled */}

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  whiteSpace: "nowrap",
                }}
              >
                <input
                  type="checkbox"
                  checked={widgetAgent.enabled}
                  onChange={(event) =>
                    updateWidgetAgent(index, {
                      enabled: event.target.checked,
                    })
                  }
                />
                Enabled
              </label>

              {/* Remove */}

              <Button_small
                text="Remove"
                onClick={() => removeWidgetAgent(index)}
              />
            </div>
          ))}

          {widgetAgents.length === 0 && (
            <Button_small text="+ Add Agent" onClick={addWidgetAgent} />
          )}
        </div>

        {/* Allowed Origins */}

        <div
          style={{
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <h3>Allowed Origins</h3>

          {allowedOrigins.map((origin, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={origin}
                placeholder="https://example.com"
                onChange={(event) => {
                  const value = event.target.value;

                  setAllowedOrigins((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? value : item,
                    ),
                  );

                  setAllowedOriginsError("");
                }}
                onBlur={() => {
                  const value = allowedOrigins[index];

                  if (!value?.trim()) {
                    return;
                  }

                  try {
                    const normalized = normalizeOrigin(value);

                    setAllowedOrigins((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? normalized : item,
                      ),
                    );

                    setAllowedOriginsError("");
                  } catch {
                    setAllowedOriginsError(
                      "Please enter a valid origin, for example https://example.com.",
                    );
                  }
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />

              <Button_small
                text="Remove"
                onClick={() => {
                  setAllowedOrigins((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  );
                }}
              />
            </div>
          ))}

          <Button_small
            text="+ Add Origin"
            onClick={() => {
              setAllowedOrigins((current) => [...current, ""]);

              setAllowedOriginsError("");
            }}
          />

          {allowedOriginsError && (
            <p
              style={{
                color: "red",
                marginTop: "8px",
              }}
            >
              {allowedOriginsError}
            </p>
          )}
        </div>

        {/* Public Widget */}

        {!isNewWidget && widget?.publicWidgetId && (
          <div
            style={{
              marginTop: "24px",
              marginBottom: "24px",
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            <strong>Public Widget ID</strong>

            <p
              style={{
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {widget.publicWidgetId}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href={`/widgets/demo/${encodeURIComponent(
                  widget.publicWidgetId,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Widget
              </a>

              <Button_small
                text="Rotate Public ID"
                onClick={() => {
                  void handleRotatePublicId();
                }}
              />
            </div>

            {allowedOrigins.length === 0 && (
              <p
                style={{
                  marginTop: "12px",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                Tip: add <code>{window.location.origin}</code> under Allowed
                Origins if the demo fails to load.
              </p>
            )}
          </div>
        )}

        {/* New widget message */}

        {isNewWidget && (
          <p
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              color: "#666",
            }}
          >
            Try Widget after creation
          </p>
        )}

        {/* Save */}

        <Button
          text={
            saving
              ? "Saving..."
              : isNewWidget
                ? "Create Widget"
                : "Save Changes"
          }
          onClick={() => {
            if (!saving) {
              void handleSave();
            }
          }}
        />
      </div>
    </DashboardLayout>
  );
}

export default EditWidget;
