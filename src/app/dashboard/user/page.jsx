import { getSession, getAuthHeaders } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  Eye,
  TrendingUp,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import { fetchDashboardStats } from "@/lib/api/user";

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  return `${months}mo ago`;
}

const QUICK_ACTIONS = [
  {
    href: "/dashboard/user/add-lesson",
    icon: PlusCircle,
    label: "Add New Lesson",
    desc: "Share a new life insight",
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.15)",
  },
  {
    href: "/lessons",
    icon: BookOpen,
    label: "Browse Lessons",
    desc: "Explore community wisdom",
    color: "#34d399",
    bg: "rgba(52,211,153,0.05)",
    border: "rgba(52,211,153,0.12)",
  },
  {
    href: "/dashboard/user/my-favorites",
    icon: Heart,
    label: "My Favorites",
    desc: "Revisit saved lessons",
    color: "#f472b6",
    bg: "rgba(236,72,153,0.05)",
    border: "rgba(236,72,153,0.12)",
  },
  {
    href: "/dashboard/user/my-lessons",
    icon: BookOpen,
    label: "My Lessons",
    desc: "Manage your lessons",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.05)",
    border: "rgba(59,130,246,0.12)",
  },
];

export const metadata = { title: " User Dashboard | LifeVault" };

export default async function DashboardHomePage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  const user = session.user;
  const authHeaders = await getAuthHeaders();
  const data = await fetchDashboardStats(session.user.id, authHeaders);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user.name?.split(" ")[0] || "there";

  const STATS = [
    {
      label: "My Lessons",
      value: data.totalLessons,
      icon: BookOpen,
      color: "#a78bfa",
      href: "/dashboard/user/my-lessons",
    },
    {
      label: "Favorites",
      value: data.totalFavorites,
      icon: Heart,
      color: "#f472b6",
      href: "/dashboard/user/my-favorites",
    },
    {
      label: "Total Views",
      value: data.totalViews,
      icon: Eye,
      color: "#34d399",
      href: "/dashboard/user/my-lessons",
    },
    {
      label: "This Week",
      value: data.thisWeek,
      icon: TrendingUp,
      color: "#fbbf24",
      href: "/dashboard/user/my-lessons",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* ── Welcome ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[3px] uppercase text-violet-400/70 mb-1">
            {greeting} ✨
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm text-white/35 mt-1.5">
            Here&apos;s what&apos;s happening with your wisdom journey.
          </p>
        </div>
        <Link
          href="/dashboard/user/add-lesson"
          className="flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shrink-0"
          style={{
            background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
            boxShadow: "0 4px 20px rgba(139,92,246,0.3)",
          }}
        >
          <PlusCircle className="w-4 h-4" /> Add Lesson
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5 group"
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
              style={{
                backgroundColor: `${stat.color}15`,
                border: `1px solid ${stat.color}25`,
              }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs mt-0.5 font-medium text-white/35">
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main grid — chart + recent ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly chart — client component */}
        <div
          className="lg:col-span-2 rounded-2xl p-5 flex flex-col gap-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.018)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-bold text-white">
                My Weekly Activity
              </h2>
            </div>
            <span className="text-xs text-white/30">
              {data.thisWeek} lesson{data.thisWeek !== 1 ? "s" : ""} this week
            </span>
          </div>

          {/* Pass weeklyData to client component */}
          <WeeklyChart weeklyData={data.weeklyData} />

          {/* Summary row */}
          <div
            className="grid grid-cols-3 gap-3 pt-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {[
              { label: "This Week", value: data.thisWeek },
              { label: "Total", value: data.totalLessons },
              { label: "Avg/Day", value: (data.thisWeek / 7).toFixed(1) },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-black text-white">{s.value}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-white px-1">Quick Actions</h2>
          {QUICK_ACTIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg group"
              style={{
                backgroundColor: item.bg,
                border: `1px solid ${item.border}`,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                style={{
                  backgroundColor: `${item.color}18`,
                  border: `1px solid ${item.color}25`,
                }}
              >
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{item.label}</p>
                <p className="text-xs mt-0.5 truncate text-white/35">
                  {item.desc}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-auto opacity-0 group-hover:opacity-40 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent Lessons ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold text-white">Recent Lessons</h2>
          </div>
          <Link
            href="/dashboard/user/my-lessons"
            className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        {data.recentLessons.length === 0 ? (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl text-center gap-4"
            style={{
              backgroundColor: "rgba(255,255,255,0.018)",
              border: "1px dashed rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.15)",
              }}
            >
              <BookOpen className="w-7 h-7 text-violet-400/50" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/40">
                No lessons yet
              </p>
              <p className="text-xs text-white/25 mt-1">
                Share your first life lesson with the community
              </p>
            </div>
            <Link
              href="/dashboard/user/add-lesson"
              className="flex items-center gap-2 px-5 h-9 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all"
              style={{
                background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
              }}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Write your first lesson
            </Link>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {data.recentLessons.map((lesson, i) => {
              const id = lesson._id?.$oid || lesson._id;
              const isLast = i === data.recentLessons.length - 1;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  style={{
                    borderBottom: isLast
                      ? "none"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Left */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-black text-violet-400"
                      style={{
                        backgroundColor: "rgba(139,92,246,0.08)",
                        border: "1px solid rgba(139,92,246,0.15)",
                      }}
                    >
                      {lesson.title?.[0] || "L"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-white/35">
                          {lesson.category}
                        </span>
                        <span className="text-[10px] text-white/20">·</span>
                        <span className="text-[10px] text-white/25 flex items-center gap-0.5">
                          <Eye className="w-2.5 h-2.5" /> {lesson.views || 0}{" "}
                          views
                        </span>
                        <span className="text-[10px] text-white/20">·</span>
                        <span className="text-[10px] text-white/25">
                          {timeAgo(lesson.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <Link
                    href={`/lessons/${id}`}
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors shrink-0"
                  >
                    View →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Weekly Reflection Prompt ── */}
      <div
        className="flex items-center justify-between gap-6 flex-wrap p-6 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.04))",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">Weekly Reflection</p>
            <p className="text-xs mt-0.5 text-white/40 leading-relaxed">
              What&apos;s one thing you learned this week? Write it before you
              forget.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/user/add-lesson"
          className="flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-bold text-white whitespace-nowrap hover:opacity-90 transition-all shrink-0"
          style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)" }}
        >
          Write Now →
        </Link>
      </div>
    </div>
  );
}
