import { getSession } from "@/lib/auth-session";
import { getAdminStats } from "@/lib/api/admin";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Shield, Star, BookOpen, Flag, Users } from "lucide-react";
import ProfileClient from "../../user/profile/ProfileClient";


export const metadata = { title: "Admin Profile | LifeVault" };

export default async function AdminProfilePage() {
  const session = await getSession();
  if (!session || session.user?.role !== "admin") redirect("/unauthorized");

  const stats = await getAdminStats();
  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "A";

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      {/* Profile card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Admin banner */}
        <div
          className="h-28 w-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.08), rgba(139,92,246,0.1))",
          }}
        />

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-black text-amber-400"
                style={{
                  backgroundColor: "#0a0a12",
                  border: "3px solid rgba(251,191,36,0.3)",
                }}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  boxShadow: "0 2px 8px rgba(245,158,11,0.5)",
                }}
              >
                <Shield className="w-3 h-3 text-black fill-black" />
              </div>
            </div>
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background:
                  "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))",
                border: "1px solid rgba(251,191,36,0.3)",
                color: "#fbbf24",
              }}
            >
              <Shield className="w-3.5 h-3.5" /> Administrator
            </span>
          </div>
          <h1 className="text-xl font-black text-white">{user.name}</h1>
          <p className="text-sm text-white/40 mt-0.5">{user.email}</p>

          {/* Platform stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              {
                label: "Total Users",
                value: stats.totalUsers,
                color: "#a78bfa",
                icon: Users,
              },
              {
                label: "Total Lessons",
                value: stats.totalLessons,
                color: "#34d399",
                icon: BookOpen,
              },
              {
                label: "Reported",
                value: stats.reportedCount,
                color: "#f87171",
                icon: Flag,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
                style={{
                  backgroundColor: `${s.color}08`,
                  border: `1px solid ${s.color}20`,
                }}
              >
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <p className="text-lg font-black text-white">{s.value ?? 0}</p>
                <p className="text-[10px] text-white/35">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reuse ProfileClient for edit */}
      <ProfileClient user={user} />
    </div>
  );
}
