"use server";
import { getAuthHeaders } from "../auth-session";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function updateLessonField(lessonId, body) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${baseUrl}/lessons/${lessonId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteLesson(lessonId) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${baseUrl}/lessons/${lessonId}`, {
    method: "DELETE",
    headers,
  });
  return res;
}
