import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";

import LessonDetailClient from "./LessonDetailClient";
import { getAuthorLessonCount, getFavoriteStatus, getLessonById, getLessonsByFilter } from "@/lib/action/lessonDetail";

export default async function LessonDetailPage({ params }) {
  const { id } = await params;

  const [lesson, session] = await Promise.all([
    getLessonById(id),
    getSession(),
  ]);

  if (!lesson) notFound();

  const currentUser = session?.user ?? null;
  const userIsPremium = currentUser?.isPremium === true;

  // Premium lesson + non-premium user → redirect
  if (lesson.accessLevel === "premium" && !userIsPremium) {
    redirect(`/pricing?reason=premium-lesson&from=/lessons/${id}`);
  }

  // Related lessons — same category OR same tone, excluding this lesson
  const [byCat, byTone] = await Promise.all([
    getLessonsByFilter({ category: lesson.category, excludeId: id, limit: 6 }),
    getLessonsByFilter({
      emotionalTone: lesson.emotionalTone,
      excludeId: id,
      limit: 6,
    }),
  ]);

  const authorLessonCount = await getAuthorLessonCount(lesson.userId);

  // Initial favorite status (only if logged in)
  const initialFavorited = currentUser ? await getFavoriteStatus(id) : false;

  return (
    <LessonDetailClient
      lesson={lesson}
      currentUser={currentUser}
      relatedByCategory={byCat}
      relatedByTone={byTone}
      authorLessonCount={authorLessonCount}
      initialFavorited={initialFavorited}
    />
  );
}
