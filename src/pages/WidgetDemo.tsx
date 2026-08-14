import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import type { PublicWidget } from "../types/Widget";
import { getPublicWidget } from "../api/widgetApi";

function parseApiErrorMessage(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as {
      exception?: { message?: string };
      message?: string;
      title?: string;
    };

    return (
      parsed.exception?.message ||
      parsed.message ||
      parsed.title ||
      raw
    );
  } catch {
    return raw;
  }
}

function WidgetDemo() {
  const { publicWidgetId: publicWidgetIdFromPath } = useParams();
  const [searchParams] = useSearchParams();

  const publicWidgetId =
    publicWidgetIdFromPath || searchParams.get("widgetId");

  const [widget, setWidget] = useState<PublicWidget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!publicWidgetId) {
      setError("Widget ID is missing.");
      setLoading(false);
      return;
    }

    const widgetId = publicWidgetId;

    async function loadWidget() {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicWidget(widgetId);

        setWidget(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load widget.";

        setError(parseApiErrorMessage(message));
      } finally {
        setLoading(false);
      }
    }

    void loadWidget();
  }, [publicWidgetId]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading widget...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", maxWidth: "640px", margin: "0 auto" }}>
        <h2>Unable to load widget</h2>
        <p style={{ color: "#b91c1c", whiteSpace: "pre-wrap" }}>{error}</p>
        <p style={{ color: "#666", marginTop: "16px" }}>
          If this is a CORS / origin error, add{" "}
          <code>{window.location.origin}</code> to the widget&apos;s Allowed
          Origins and save, then try again.
        </p>
        <p style={{ marginTop: "16px" }}>
          <Link to="/widgets">Back to widgets</Link>
        </p>
      </div>
    );
  }

  if (!widget) {
    return (
      <div style={{ padding: "40px" }}>
        Widget not found.{" "}
        <Link to="/widgets">Back to widgets</Link>
      </div>
    );
  }

  const welcomeMessage =
    widget.assignedAgent?.welcomeMessages?.[0]?.message?.text;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "380px",
          maxWidth: "100%",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            borderBottom: "1px solid #eee",
          }}
        >
          {widget.avatarUrl ? (
            <img
              src={widget.avatarUrl}
              alt={widget.name}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "#2563eb",
              }}
            />
          )}

          <div>
            <strong>{widget.name}</strong>
          </div>
        </div>

        <div
          style={{
            minHeight: "300px",
            padding: "20px",
          }}
        >
          {welcomeMessage ? (
            <div
              style={{
                display: "inline-block",
                maxWidth: "80%",
                padding: "10px 14px",
                background: "#f1f1f1",
                borderRadius: "12px",
              }}
            >
              {welcomeMessage}
            </div>
          ) : (
            <p style={{ color: "#666" }}>No welcome message available.</p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "12px",
            borderTop: "1px solid #eee",
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />

          <button
            type="button"
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default WidgetDemo;
