"use server";
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchMyLessons(userId) {
  try {
    const res = await fetch(`${baseUrl}/lessons?userId=${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.lessons || [];
  } catch {
    return [];
  }
}
