import { getLessonsPaginated } from "@/lib/api/lessons";
import { getSession } from "@/lib/auth-session";
import LessonCard from "@/components/LessonCard";
import LessonsFilterBar from "@/components/LessonsFilterBar";
import LessonsPagination from "@/components/LessonsPagination";

export default async function LessonsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page || "1"));

  const [data, session] = await Promise.all([
    getLessonsPaginated({
      page,
      search: sp?.search || "",
      category: sp?.category || "",
      emotionalTone: sp?.emotionalTone || "",
      sort: sp?.sort || "newest",
    }),
    getSession(),
  ]);

  const lessons = data.lessons ?? [];

  return (
    <div className="min-h-screen bg-[#080810]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white">Browse Lessons</h1>
          <p className="text-sm text-white/40 mt-1">
            {data.total ?? lessons.length} lesson
            {(data.total ?? lessons.length) !== 1 ? "s" : ""} found
          </p>
        </div>

        <LessonsFilterBar />

        {lessons.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-sm">
              No lessons match your filters. Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson._id?.$oid || lesson._id}
                lesson={lesson}
                currentUser={session?.user}
              />
            ))}
          </div>
        )}

        <LessonsPagination
          currentPage={data.page ?? page}
          totalPages={data.totalPages ?? 1}
        />
      </div>
    </div>
  );
}
