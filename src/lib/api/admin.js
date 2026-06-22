import { getAuthHeaders } from "@/lib/auth-session";

const base = process.env.NEXT_PUBLIC_SERVER_URL;

async function adminFetch(path, opts = {}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${base}${path}`, {
    cache: "no-store",
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...opts.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const getAdminStats = () => adminFetch("/admin/stats");
export const getAdminUsers = () => adminFetch("/admin/users");
export const getAdminLessons = (params = {}) =>
  adminFetch(`/admin/lessons?${new URLSearchParams(params)}`);
export const getAdminReports = () => adminFetch("/admin/reports");
