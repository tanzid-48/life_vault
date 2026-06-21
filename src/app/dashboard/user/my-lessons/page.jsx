import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, BookOpen } from "lucide-react";
import MyLessonsClient from "@/components/dashboard/user/MyLessonsClient";
import { fetchMyLessons } from "@/lib/api/my-lessons";

export const metadata = { title: "My Lessons | LifeVault" };

export default async function MyLessonsPage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  const lessons = await fetchMyLessons(session.user.id);
  const isPremium = session.user?.isPremium === true;
  const total = lessons.length;
  const premium = lessons.filter((l) => l.accessLevel === "premium").length;
  const views = lessons.reduce((s, l) => s + (l.views || 0), 0);

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-violet-400/70">
            My Content
          </span>
          <h1 className="text-2xl font-black text-white mt-0.5">My Lessons</h1>
          <p className="text-sm text-white/35 mt-1">
            {total} lesson{total !== 1 ? "s" : ""} created
          </p>
        </div>
        <Link
          href="/dashboard/add-lesson"
          className="flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            boxShadow: "0 4px 16px rgba(139,92,246,0.3)",
          }}
        >
          <PlusCircle className="w-4 h-4" /> Add Lesson
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Lessons", value: total, color: "#a78bfa" },
          { label: "Total Views", value: views, color: "#34d399" },
          { label: "Premium", value: premium, color: "#fbbf24" },
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

      {/* Client table */}
      {lessons.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl text-center gap-4"
          style={{
            backgroundColor: "rgba(255,255,255,0.018)",
            border: "1px dashed rgba(255,255,255,0.1)",
          }}
        >
          <BookOpen className="w-12 h-12 text-white/10" />
          <p className="text-sm font-semibold text-white/40">No lessons yet</p>
          <p className="text-xs text-white/25">
            Share your first life lesson with the community
          </p>
          <Link
            href="/dashboard/add-lesson"
            className="px-5 h-9 rounded-xl text-xs font-bold text-white flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Write your first lesson
          </Link>
        </div>
      ) : (
        <MyLessonsClient initialLessons={lessons} isPremium={isPremium} />
      )}
    </div>
  );
}
