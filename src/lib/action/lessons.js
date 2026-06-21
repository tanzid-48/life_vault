"use server";

import { getAuthHeaders, getSession } from "../auth-session";


const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const createLesson = async (payload) => {
  try {
    const session = await getSession();
    const user = session?.user;

    const headers = await getAuthHeaders();
    const res = await fetch(`${baseUrl}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        ...payload,
        userId: user?.id,
        userName: user?.name,
        userAvatar: user?.image || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, ...data };
  } catch {
    return { success: false, message: "Server unreachable" };
  }
};
