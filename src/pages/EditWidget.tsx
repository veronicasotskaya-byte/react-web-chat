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
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading widget...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!isNewWidget && !widget) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Widget not found.
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  const selectClassName = [
    "block rounded-lg border border-gray-300 bg-white px-3 py-2.5",
    "text-sm text-gray-900",
    "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500",
  ].join(" ");

  const checkboxClassName =
    "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {isNewWidget ? "Create Widget" : "Edit Widget"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isNewWidget
              ? "Create a new widget and assign an agent."
              : "Update this widget's details, agents, and allowed origins."}
          </p>
        </div>

        {!isNewWidget && widget?.publicWidgetId && (
          <div className="flex w-1/2 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Public Widget ID
              </p>
              <p className="mt-1 break-all font-mono text-sm text-gray-600">
                {widget.publicWidgetId}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <a
                href={`/widgets/demo/${encodeURIComponent(
                  widget.publicWidgetId,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
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
          </div>
        )}

        <div className="w-1/2 rounded-xl border border-gray-200 bg-white p-6">
          <Input
            label="Widget Name"
            type="text"
            value={name}
            placeholder="Widget name"
            onChange={setName}
            required
            error={nameError}
          />

          <Input
            label="Avatar URL"
            type="text"
            value={avatarUrl}
            placeholder="Avatar URL"
            onChange={setAvatarUrl}
          />

          <div className="mb-5 space-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)}
                className={checkboxClassName}
              />
              Enabled
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={standAlonePublic}
                onChange={(event) => setStandAlonePublic(event.target.checked)}
                className={checkboxClassName}
              />
              Standalone Public
            </label>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-base font-semibold text-gray-900">
              Agents
            </h3>

            {widgetAgents.length === 0 && (
              <p className="mb-3 text-sm text-gray-500">
                No agent or bot assigned to this widget.
              </p>
            )}

            <div className="space-y-3">
              {widgetAgents.map((widgetAgent, index) => (
                <div
                  key={`${widgetAgent.widgetAgentId}-${index}`}
                  className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                >
                  <span className="w-6 text-sm font-semibold text-gray-900">
                    {index + 1}.
                  </span>

                  <select
                    value={widgetAgent.agentId}
                    onChange={(event) =>
                      updateWidgetAgent(index, {
                        agentId: Number(event.target.value),
                      })
                    }
                    className={`${selectClassName} min-w-0 flex-1`}
                  >
                    {agentsAndBots
                      .filter((item) => "userId" in item && item.userId != null)
                      .map((item) => (
                        <option key={item.userId} value={item.userId}>
                          {item.name}
                        </option>
                      ))}
                  </select>

                  <select
                    value={widgetAgent.action}
                    onChange={(event) =>
                      updateWidgetAgent(index, {
                        action: event.target.value as "Assign" | "Notify",
                      })
                    }
                    className={selectClassName}
                  >
                    <option value="Assign">Assign</option>
                    <option value="Notify">Notify</option>
                  </select>

                  <label className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={widgetAgent.enabled}
                      onChange={(event) =>
                        updateWidgetAgent(index, {
                          enabled: event.target.checked,
                        })
                      }
                      className={checkboxClassName}
                    />
                    Enabled
                  </label>

                  <Button_small
                    text="Remove"
                    onClick={() => removeWidgetAgent(index)}
                  />
                </div>
              ))}
            </div>

            {widgetAgents.length === 0 && (
              <div className="mt-4">
                <Button_small text="+ Add Agent" onClick={addWidgetAgent} />
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-base font-semibold text-gray-900">
              Allowed Origins
            </h3>

            <div className="space-y-3">
              {allowedOrigins.map((origin, index) => (
                <div key={index} className="flex items-center gap-2">
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
                    className={[
                      "block min-w-0 flex-1 rounded-lg border bg-white px-3 py-2.5",
                      "text-sm text-gray-900 placeholder:text-gray-400",
                      "focus:outline-none focus:ring-2",
                      allowedOriginsError
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
                    ].join(" ")}
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
            </div>

            <div className="mt-4">
              <Button_small
                text="+ Add Origin"
                onClick={() => {
                  setAllowedOrigins((current) => [...current, ""]);
                  setAllowedOriginsError("");
                }}
              />
            </div>

            {allowedOriginsError && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {allowedOriginsError}
              </p>
            )}
          </div>

          {isNewWidget && (
            <p className="mt-6 text-sm text-gray-500">
              Try Widget after creation
            </p>
          )}

          <div className="mt-6">
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
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditWidget;
