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

export async function getAdminLessons(params = {}) {
  try {
    const query = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.category && { category: params.category }),
      ...(params.accessLevel && { accessLevel: params.accessLevel }),
      ...(params.search && { search: params.search }),
    }).toString();

    return await adminFetch(`/admin/lessons?${query}`);
  } catch (error) {
    console.error("Error fetching admin lessons:", error);

    return { lessons: [], total: 0, totalPages: 1, page: 1 };
  }
}

export const getAdminStats = () => adminFetch("/admin/stats");
export const getAdminUsers = () => adminFetch("/admin/users");
export const getAdminReports = () => adminFetch("/admin/reports");
