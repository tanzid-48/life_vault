import { getAdminLessons } from "@/lib/api/admin";
import ManageLessonsClient from "./ManageLessonsClient";

export const metadata = { title: "Manage Lessons | Admin" };

export default async function ManageLessonsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const limit = 10;

  const data = await getAdminLessons({
    page,
    limit,
    category: sp?.category,
    accessLevel: sp?.accessLevel,
    search: sp?.search,
  });

  const lessons = data.lessons ?? [];

  const pub = lessons.filter((l) => l.isPublic !== false).length;
  const priv = lessons.filter((l) => l.isPublic === false).length;
  const flag = lessons.filter((l) => l.reportCount > 0).length;

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div>
        <span className="text-[10px] font-bold tracking-[3px] uppercase text-amber-400/70">
          Admin
        </span>
        <h1 className="text-2xl font-black text-white mt-0.5">
          Manage Lessons
        </h1>
        <p className="text-sm text-white/35 mt-1">
          {data.total ?? lessons.length} total lessons on the platform
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Public", value: pub, color: "#34d399" },
          { label: "Private", value: priv, color: "#60a5fa" },
          { label: "Flagged", value: flag, color: "#f87171" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-1 p-4 rounded-2xl text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-2xl font-black" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-xs text-white/35">{s.label}</p>
          </div>
        ))}
      </div>

      <ManageLessonsClient
        initialLessons={data.lessons}
        currentPage={data.page}
        totalPages={data.totalPages}
        total={data.total}
      />
    </div>
  );
}
