
import { getSession } from "@/lib/auth-session";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Flag,
  TrendingUp,
  Eye,
  Star,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { getAdminStats } from "@/lib/api/admin";

export const metadata = { title: "Admin Dashboard | LifeVault" };

const StatCard = ({ label, value, icon: Icon, color, href, sub }) => (
  <Link
    href={href || "#"}
    className="flex flex-col gap-3 p-5 rounded-2xl transition-all hover:-translate-y-0.5 group"
    style={{
      backgroundColor: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div className="flex items-start justify-between">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
        style={{
          backgroundColor: `${color}15`,
          border: `1px solid ${color}25`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {sub && (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "rgba(52,211,153,0.1)", color: "#34d399" }}
        >
          {sub}
        </span>
      )}
    </div>
    <div>
      <p className="text-3xl font-black text-white">{value ?? "—"}</p>
      <p className="text-xs text-white/40 mt-0.5 font-medium">{label}</p>
    </div>
  </Link>
);

export default async function AdminDashboardPage() {
  const [session, stats] = await Promise.all([getSession(), getAdminStats()]);

  const name = session?.user?.name || "Admin";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxWeek = Math.max(...(stats.weeklyData || [1]), 1);

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-amber-400/70">
            Admin Panel
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-0.5">
            Welcome back, {name.split(" ")[0]} 🛡️
          </h1>
          <p className="text-sm text-white/35 mt-1.5">
            Platform overview and moderation tools.
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{
            backgroundColor: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.15)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400">Live</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="#a78bfa"
          href="/dashboard/admin/manage-users"
          sub="All time"
        />
        <StatCard
          label="Public Lessons"
          value={stats.publicLessons}
          icon={BookOpen}
          color="#34d399"
          href="/dashboard/admin/manage-lessons"
          sub="Active"
        />
        <StatCard
          label="Reported"
          value={stats.reportedCount}
          icon={AlertTriangle}
          color="#f87171"
          href="/dashboard/admin/reported-lessons"
          sub="Pending"
        />
        <StatCard
          label="Today's Lessons"
          value={stats.todayLessons}
          icon={TrendingUp}
          color="#fbbf24"
          href="/dashboard/admin/manage-lessons"
          sub="New"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly bar chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-5 flex flex-col gap-4"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white">
                Lessons This Week
              </h3>
            </div>
            <span className="text-xs text-white/30">Last 7 days</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {(stats.weeklyData || Array(7).fill(0)).map((count, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <div
                  className="relative w-full group rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${Math.max((count / maxWeek) * 100, 4)}%`,
                    background:
                      i === 6
                        ? "linear-gradient(180deg, #a78bfa, #7c3aed)"
                        : "rgba(139,92,246,0.2)",
                  }}
                >
                  <div
                    className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex px-1.5 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap"
                    style={{ backgroundColor: "rgba(139,92,246,0.9)" }}
                  >
                    {count}
                  </div>
                </div>
                <span className="text-[10px] text-white/30">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform overview */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white">Platform Stats</h3>
          {[
            {
              label: "Total Lessons",
              value: stats.totalLessons,
              color: "#a78bfa",
            },
            {
              label: "Public Lessons",
              value: stats.publicLessons,
              color: "#34d399",
            },
            {
              label: "Private Lessons",
              value: stats.privateLessons,
              color: "#60a5fa",
            },
            {
              label: "Flagged Content",
              value: stats.reportedCount,
              color: "#f87171",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-xs text-white/50">{item.label}</p>
              <p className="text-sm font-black" style={{ color: item.color }}>
                {item.value ?? 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      {stats.topContributors?.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "rgba(255,255,255,0.018)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3 className="text-sm font-bold text-white">
              Most Active Contributors
            </h3>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {stats.topContributors.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-white/20 w-4">
                    #{i + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-violet-400"
                    style={{
                      backgroundColor: "rgba(139,92,246,0.08)",
                      border: "1px solid rgba(139,92,246,0.15)",
                    }}
                  >
                    {c.userName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {c.userName || "Anonymous"}
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(139,92,246,0.08)",
                    color: "#a78bfa",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                >
                  {c.count} lessons
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            href: "/dashboard/admin/manage-users",
            label: "Manage Users",
            color: "#a78bfa",
            desc: `${stats.totalUsers || 0} total`,
          },
          {
            href: "/dashboard/admin/manage-lessons",
            label: "Manage Lessons",
            color: "#34d399",
            desc: `${stats.totalLessons || 0} total`,
          },
          {
            href: "/dashboard/admin/reported-lessons",
            label: "Reported",
            color: "#f87171",
            desc: `${stats.reportedCount || 0} pending`,
          },
          {
            href: "/dashboard/admin/profile",
            label: "Admin Profile",
            color: "#fbbf24",
            desc: "View profile",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col gap-2 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-sm font-bold text-white">{item.label}</p>
            <p className="text-xs" style={{ color: item.color }}>
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
