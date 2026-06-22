"use server";

import { getAuthHeaders } from "@/lib/auth-session";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getLessonById(id) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/lessons/${id}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...headers },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      ...data,
      _id: data._id?.$oid || data._id?.toString() || id,
    };
  } catch {
    return null;
  }
}

export const getLessonsByFilter = async ({
  category,
  emotionalTone,
  excludeId,
  limit = 6,
}) => {
  try {
    const params = new URLSearchParams({ limit });
    if (category) params.set("category", category);
    if (emotionalTone) params.set("emotionalTone", emotionalTone);
    if (excludeId) params.set("excludeId", excludeId);
    const res = await fetch(`${baseUrl}/lessons?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.lessons ?? []);
  } catch {
    return [];
  }
};

export const getAuthorLessonCount = async (userId) => {
  try {
    const params = new URLSearchParams({ userId, limit: 1 });
    const res = await fetch(`${baseUrl}/lessons?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total ?? 0;
  } catch {
    return 0;
  }
};

// ── Protected

export const toggleLike = async (lessonId) => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/lessons/${lessonId}/like`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
    });
    const d = await res.json();
    if (!res.ok) return { success: false, message: d.message };
    return { success: true, ...d };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
};

export const toggleFavorite = async (lessonId) => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/favorites/${lessonId}`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
    });
    const d = await res.json();
    if (!res.ok) return { success: false, message: d.message };
    return { success: true, ...d };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
};

export const getFavoriteStatus = async (lessonId) => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/favorites/${lessonId}/status`, {
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) return false;
    const d = await res.json();
    return d.saved ?? false;
  } catch {
    return false;
  }
};

export const getComments = async (lessonId) => {
  try {
    const res = await fetch(`${baseUrl}/comments?lessonId=${lessonId}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
};

export const addComment = async (lessonId, content) => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/comments`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, content }),
    });
    const d = await res.json();
    if (!res.ok) return { success: false, message: d.message };
    return { success: true, comment: d.comment };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
};

export const reportLesson = async (lessonId, reason) => {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/reports`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, reason }),
    });
    const d = await res.json();
    if (!res.ok) return { success: false, message: d.message };
    return { success: true };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
};
