import { getAuthHeaders, getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import LessonCard from "@/components/LessonCard";
import { Star, BookOpen, Heart } from "lucide-react";
import Image from "next/image";
import { getFavoriteCount, getPublicLessons } from "@/lib/action/profile";

export const metadata = { title: "My Profile | LifeVault" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  const user = session.user;

  const [lessons, favoriteCount] = await Promise.all([
    getPublicLessons(user.id),
    getFavoriteCount(getAuthHeaders),
  ]);

  const initials =
    user.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Profile Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Banner */}
        <div
          className="h-28 w-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.1), rgba(236,72,153,0.08))",
          }}
        />

        <div className="px-6 pb-6">
          {/* Avatar + badge row */}
          <div className="flex items-end justify-between -mt-10 mb-4 flex-wrap gap-3">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-black text-violet-400"
                style={{
                  backgroundColor: "#0a0a12",
                  border: "3px solid rgba(255,255,255,0.1)",
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
              {user.isPremium && (
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    boxShadow: "0 2px 8px rgba(245,158,11,0.5)",
                  }}
                >
                  <Star className="w-3 h-3 text-black fill-black" />
                </div>
              )}
            </div>

            {/* Premium badge */}
            {user.isPremium ? (
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))",
                  border: "1px solid rgba(251,191,36,0.3)",
                  color: "#fbbf24",
                }}
              >
                <Star className="w-3.5 h-3.5 fill-current" /> Premium Member
              </span>
            ) : (
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/40"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Free Plan
              </span>
            )}
          </div>

          {/* Name + email */}
          <h1 className="text-xl font-black text-white">{user.name}</h1>
          <p className="text-sm text-white/40 mt-0.5">{user.email}</p>

          {/* Stats row */}
          <div className="flex items-center gap-5 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.15)",
                }}
              >
                <BookOpen className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-base font-black text-white">
                  {lessons.length}
                </p>
                <p className="text-[10px] text-white/35">Lessons</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(244,114,182,0.08)",
                  border: "1px solid rgba(244,114,182,0.15)",
                }}
              >
                <Heart className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <p className="text-base font-black text-white">
                  {favoriteCount}
                </p>
                <p className="text-[10px] text-white/35">Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <ProfileClient user={user} />

      {/* Public lessons */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Public Lessons</h2>
          <span className="text-xs text-white/35">{lessons.length} total</span>
        </div>

        {lessons.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-14 rounded-2xl text-center gap-3"
            style={{
              backgroundColor: "rgba(255,255,255,0.018)",
              border: "1px dashed rgba(255,255,255,0.08)",
            }}
          >
            <BookOpen className="w-10 h-10 text-white/10" />
            <p className="text-sm text-white/35">No public lessons yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson._id?.$oid || lesson._id}
                lesson={lesson}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
