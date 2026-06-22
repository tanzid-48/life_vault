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

// Top contributors this week
export async function getTopContributors() {
  try {
    const res = await fetch(`${base}/users/top-contributors`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// Most saved lessons
export async function getMostSavedLessons() {
  try {
    const res = await fetch(`${base}/lessons/most-saved`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
