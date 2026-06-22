"use server";
import { getAuthHeaders } from "@/lib/auth-session";

const base = process.env.NEXT_PUBLIC_SERVER_URL;

async function adminAction(path, method = "PATCH", body) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, ...data };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
}

export const updateUserRole = (id, role) =>
  adminAction(`/admin/users/${id}/role`, "PATCH", { role });
export const suspendUser = (id, suspended) =>
  adminAction(`/admin/users/${id}/suspend`, "PATCH", { suspended });
export const deleteUser = (id) => adminAction(`/admin/users/${id}`, "DELETE");
export const featureLesson = (id, featured) =>
  adminAction(`/admin/lessons/${id}/feature`, "PATCH", { featured });
export const markReviewed = (id) =>
  adminAction(`/admin/lessons/${id}/reviewed`, "PATCH");
export const deleteLesson = (id) =>
  adminAction(`/admin/lessons/${id}`, "DELETE");
export const resolveReports = (lessonId) =>
  adminAction(`/admin/reports/resolve/${lessonId}`, "PATCH");
export const deleteLessonReport = (lessonId) =>
  adminAction(`/admin/lessons/${lessonId}`, "DELETE");
