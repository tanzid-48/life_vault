const base = process.env.NEXT_PUBLIC_SERVER_URL;

// Featured lessons (admin marked)
export async function getFeaturedLessons() {
  try {
    const res = await fetch(`${base}/lessons/featured`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
