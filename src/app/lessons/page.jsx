import { getLessonsPaginated } from "@/lib/api/lessons";
import { getSession } from "@/lib/auth-session";
import LessonCard from "@/components/LessonCard";

export default async function LessonsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page || "1"));

  const [data, session] = await Promise.all([
    getLessonsPaginated({
      page,
      search: sp?.search || "",
      category: sp?.category || "",
    }),
    getSession(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.lessons.map((lesson) => (
          <LessonCard
            key={lesson._id?.$oid || lesson._id}
            lesson={lesson}
            currentUser={session?.user}
          />
        ))}
      </div>
    </div>
  );
}
