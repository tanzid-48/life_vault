const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchDashboardStats(userId, authHeaders) {
  try {
    const [lessonsRes, favRes, statsRes] = await Promise.all([
      fetch(`${baseUrl}/lessons?userId=${userId}`, { cache: "no-store" }),
      fetch(`${baseUrl}/favorites`, {
        cache: "no-store",
        headers: authHeaders,
      }),
      fetch(`${baseUrl}/lessons/weekly-stats?userId=${userId}`, {
        cache: "no-store",
      }),
    ]);

    const lessonsRaw = lessonsRes.ok ? await lessonsRes.json() : [];
    const favRaw = favRes.ok ? await favRes.json() : [];
    const statsRaw = statsRes.ok
      ? await statsRes.json()
      : { counts: Array(7).fill(0) };

    const lessons = Array.isArray(lessonsRaw)
      ? lessonsRaw
      : lessonsRaw.lessons || [];
    const views = lessons.reduce((s, l) => s + (l.views || 0), 0);
    const thisWeek = (statsRaw.counts || []).reduce((a, b) => a + b, 0);

    return {
      totalLessons: lessons.length,
      totalFavorites: Array.isArray(favRaw) ? favRaw.length : 0,
      totalViews: views,
      thisWeek,
      recentLessons: lessons.slice(0, 5),
      weeklyData: statsRaw.counts || Array(7).fill(0),
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return {
      totalLessons: 0,
      totalFavorites: 0,
      totalViews: 0,
      thisWeek: 0,
      recentLessons: [],
      weeklyData: Array(7).fill(0),
    };
  }
}
