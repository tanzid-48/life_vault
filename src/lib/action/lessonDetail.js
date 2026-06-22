"use server";
import { getAuthHeaders } from "@/lib/auth-session";

const base = process.env.NEXT_PUBLIC_SERVER_URL;

// ── PUBLIC

export async function getLessonById(id) {
  try {
    const res = await fetch(`${base}/lessons/${id}`, {
      cache: "no-store",
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
} = {}) => {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (category) params.set("category", category);
    if (emotionalTone) params.set("emotionalTone", emotionalTone);
    const res = await fetch(`${base}/lessons?${params}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const arr = Array.isArray(data) ? data : (data.lessons ?? []);

    return arr.filter(
      (l) => (l._id?.$oid || l._id?.toString() || l._id) !== excludeId,
    );
  } catch {
    return [];
  }
};

export const getAuthorLessonCount = async (userId) => {
  try {
    if (!userId) return 0;
    const res = await fetch(`${base}/lessons?userId=${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    if (Array.isArray(data)) return data.length;
    return data.total ?? data.lessons?.length ?? 0;
  } catch {
    return 0;
  }
};

export const getComments = async (lessonId) => {
  try {
    const res = await fetch(`${base}/comments?lessonId=${lessonId}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
};

// ── PROTECTED

export const getFavoriteStatus = async (lessonId) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base}/favorites/${lessonId}/status`, {
      cache: "no-store",
      headers,
    });
    if (!res.ok) return false;
    const d = await res.json();
    return d.saved ?? false;
  } catch {
    return false;
  }
};

export const toggleLike = async (lessonId) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base}/lessons/${lessonId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
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
    const headers = await getAuthHeaders();
    const res = await fetch(`${base}/favorites/${lessonId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
    });
    const d = await res.json();
    if (!res.ok) return { success: false, message: d.message };
    return { success: true, ...d };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
};

export const addComment = async (lessonId, content) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
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
    const headers = await getAuthHeaders();
    const res = await fetch(`${base}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ lessonId, reason }),
    });
    const d = await res.json();
    if (!res.ok) return { success: false, message: d.message };
    return { success: true };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
};
