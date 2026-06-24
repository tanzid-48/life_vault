"use server";
import { getAuthHeaders } from "@/lib/auth-session";

const base = process.env.NEXT_PUBLIC_SERVER_URL;

export async function updateLessonField(id, data) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base}/lessons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || "Failed" };
    }

    return { success: true, ...result };
  } catch (err) {
    console.error("updateLessonField error:", err);
    return { success: false, message: "Network error" };
  }
}

export async function deleteLesson(lessonId) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base}/lessons/${lessonId}`, {
      method: "DELETE",
      headers,
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: d.message || "Failed" };
    return { success: true };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
}
