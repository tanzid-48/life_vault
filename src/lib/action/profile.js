"use server";
import { getAuthHeaders } from "@/lib/auth-session";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getPublicLessons(userId) {
  try {
    const res = await fetch(`${baseUrl}/lessons?userId=${userId}&sort=newest`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data)
      ? data.filter((l) => l.isPublic !== false)
      : (data.lessons || []).filter((l) => l.isPublic !== false);
  } catch {
    return [];
  }
}

export async function getFavoriteCount() {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/favorites`, {
      cache: "no-store",
      headers: authHeaders,
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}
