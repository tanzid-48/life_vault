"use server";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const activatePremium = async (userId) => {
  try {
    const res = await fetch(`${baseUrl}/users/${userId}/premium`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET,
      },
      body: JSON.stringify({ isPremium: true }),
    });

    if (!res.ok) {
      console.error(`Failed to activate premium for ${userId}:`, res.status);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("activatePremium error:", err);
    return { success: false };
  }
};
