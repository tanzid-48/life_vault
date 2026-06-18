"use server";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const createLesson = async (payload) => {
  try {
    const res = await fetch(`${baseUrl}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, ...data };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
};
