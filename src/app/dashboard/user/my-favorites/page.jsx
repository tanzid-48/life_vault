import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

import { Heart } from "lucide-react";
import MyFavoritesClient from "./MyFavoritesClient";
import { getMyFavoritesData } from "@/lib/action/favorites";

export const metadata = { title: "My Favorites | LifeVault" };

export default async function MyFavoritesPage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  
  const lessons = await getMyFavoritesData();

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-white">My Favorites</h1>
        <p className="text-sm text-white/35">{lessons.length} saved lessons</p>
      </div>

      {lessons.length === 0 ? (
        <EmptyState />
      ) : (
        <MyFavoritesClient
          initialLessons={lessons}
          currentUser={session.user}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl">
      <Heart className="w-12 h-12 text-white/10" />
      <p className="text-sm text-white/40 mt-4">No favorites yet</p>
    </div>
  );
}
