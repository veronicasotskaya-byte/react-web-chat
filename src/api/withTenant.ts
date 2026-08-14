export function withTenant(url: string, tenantId?: string | null) {
  if (tenantId == null || tenantId === "") {
    return url;
  }

  const id: string = tenantId;
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}tenantId=${encodeURIComponent(id)}`;
}
