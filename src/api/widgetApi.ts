
import type { Widget, PublicWidget } from "../types/Widget";
import { withTenant } from "./withTenant";

export async function getPublicWidget(
  publicWidgetId: string,
): Promise<PublicWidget> {
  const response = await fetch(
    `/api/Widget/${encodeURIComponent(publicWidgetId)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");

    throw new Error(
      details
        ? `Failed to load widget (${response.status}): ${details}`
        : `Failed to load widget (${response.status})`,
    );
  }

  return (await response.json()) as PublicWidget;
}

export async function getWidgets(tenantId?: string | null) {
  const response = await fetch(withTenant("/api/widgets", tenantId), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load widgets");
  }

  return (await response.json()) as Widget[];
}

export async function saveWidget(
  widget: Widget,
  tenantId?: string | null,
) {
  const response = await fetch(
    withTenant("/api/widgets", tenantId),
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        widget,
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");

    throw new Error(
      `Failed to save widget (${response.status})${
        details ? `: ${details}` : ""
      }`,
    );
  }

  const text = await response.text();

  if (!text) {
    return widget.widgetId;
  }

  try {
    return JSON.parse(text) as number;
  } catch {
    const widgetId = Number(text);

    if (!Number.isNaN(widgetId)) {
      return widgetId;
    }

    return widget.widgetId;
  }
}

export async function deleteWidget(
  widgetId: number,
  tenantId?: string | null,
) {
  if (widgetId == null || Number.isNaN(Number(widgetId))) {
    throw new Error("Failed to delete widget: missing widgetId");
  }

  const response = await fetch(
    withTenant(`/api/widgets/${widgetId}`, tenantId),
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");

    throw new Error(
      `Failed to delete widget (${response.status})${
        details ? `: ${details}` : ""
      }`,
    );
  }

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

export async function rotatePublicWidgetId(
  widgetId: number,
  tenantId?: string | null,
) {
  if (widgetId == null || Number.isNaN(Number(widgetId))) {
    throw new Error(
      "Failed to rotate public widget ID: missing widgetId",
    );
  }

  const response = await fetch(
    withTenant(`/api/widgets/${widgetId}/public-id`, tenantId),
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");

    throw new Error(
      `Failed to rotate public widget ID (${response.status})${
        details ? `: ${details}` : ""
      }`,
    );
  }

  return (await response.json()) as string | null;
}

