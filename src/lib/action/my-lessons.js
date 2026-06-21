"use server";
import { getAuthHeaders } from "../auth-session";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function updateLessonField(id, data) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/lessons/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Action Error:", error);
    return { success: false, message: "Network error occurred" };
  }
}
export async function deleteLesson(lessonId) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/lessons/${lessonId}`, {
      method: "DELETE",
      headers,
    });

    const d = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: d.message || "Failed to delete" };
    }

    return { success: true, ...d };
  } catch (error) {
    return { success: false, message: "Server unreachable" };
  }
}
