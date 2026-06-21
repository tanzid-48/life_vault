const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getLessonsPaginated = async ({
  page = 1,
  limit = 9,
  search = "",
  category = "",
  emotionalTone = "",
  accessLevel = "",
  sort = "newest",
} = {}) => {
  try {
    const params = new URLSearchParams({ page, limit, sort });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (emotionalTone) params.set("emotionalTone", emotionalTone);
    if (accessLevel) params.set("accessLevel", accessLevel);

    const res = await fetch(`${baseUrl}/lessons?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return { lessons: [], total: 0, totalPages: 1 };
    return res.json();
  } catch {
    return { lessons: [], total: 0, totalPages: 1 };
  }
};


export const getAllLessons = async (query = {}) => {
  try {
    const params = new URLSearchParams(query);
    const res = await fetch(`${baseUrl}/lessons?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
};
