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

    return parsed.exception?.message || parsed.message || parsed.title || raw;
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-xl border border-gray-200 bg-white px-8 py-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading widget...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Unable to load widget
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm font-medium text-red-600">
            {error}
          </p>
          <p className="mt-6">
            <Link
              to="/widgets"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Back to widgets
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (!widget) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Widget not found.
          </h2>
          <p className="mt-4">
            <Link
              to="/widgets"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Back to widgets
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const welcomeMessage =
    widget.assignedAgent?.welcomeMessages?.[0]?.message?.text;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
          {widget.avatarUrl ? (
            <img
              src={widget.avatarUrl}
              alt={widget.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-indigo-600" />
          )}

          <p className="text-sm font-semibold text-gray-900">{widget.name}</p>
        </div>

        <div className="min-h-[300px] p-5">
          {welcomeMessage ? (
            <div className="inline-block max-w-[80%] rounded-xl bg-gray-100 px-3.5 py-2.5 text-sm text-gray-800">
              {welcomeMessage}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No welcome message available.</p>
          )}
        </div>

        <div className="flex gap-2 border-t border-gray-100 p-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default WidgetDemo;
