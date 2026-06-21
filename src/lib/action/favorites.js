"use server";

import { getAuthHeaders } from "../auth-session";


const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getMyFavoritesData() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/favorites`, {
      cache: "no-store",
      headers,
    });
    if (!res.ok) return [];
    const favorites = await res.json();

    const lessonIds = favorites.map((f) => f.lessonId);
    return await getLessonsByIds(lessonIds);
  } catch {
    return [];
  }
}

export async function getLessonsByIds(lessonIds) {
  if (!lessonIds || lessonIds.length === 0) return [];
  try {
    const results = await Promise.all(
      lessonIds.map((id) =>
        fetch(`${baseUrl}/lessons/${id}`, { cache: "no-store" })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ),
    );
    return results.filter(Boolean);
  } catch {
    return [];
  }
}
