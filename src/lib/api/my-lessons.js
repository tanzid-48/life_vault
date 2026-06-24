const base = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchMyLessons(userId) {
  try {
    const res = await fetch(`${base}/lessons?userId=${userId}&mine=true`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.lessons || [];
  } catch {
    return [];
  }
}
