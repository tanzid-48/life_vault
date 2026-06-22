import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import LessonDetailClient from "./LessonDetailClient";
import {
  getLessonById,
  getLessonsByFilter,
  getAuthorLessonCount,
  getFavoriteStatus,
  getComments,
} from "@/lib/action/lessonDetail";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const lesson = await getLessonById(id);
  if (!lesson) return { title: "Lesson Not Found | LifeVault" };
  return {
    title: `${lesson.title} | LifeVault`,
    description: lesson.description?.slice(0, 150),
  };
}

export default async function LessonDetailPage({ params }) {
  const { id } = await params;

  const [lesson, session] = await Promise.all([
    getLessonById(id),
    getSession(),
  ]);

  if (!lesson) notFound();

  const currentUser = session?.user ?? null;
  const userIsPremium = currentUser?.isPremium === true;
  const isOwner = currentUser?.id === lesson.userId;
  const isLocked =
    lesson.accessLevel === "premium" && !userIsPremium && !isOwner;

  // parallel fetch — no waterfall
  const [byCat, byTone, initialComments, authorLessonCount, initialFavorited] =
    await Promise.all([
      getLessonsByFilter({
        category: lesson.category,
        excludeId: id,
        limit: 6,
      }),
      getLessonsByFilter({
        emotionalTone: lesson.emotionalTone,
        excludeId: id,
        limit: 6,
      }),
      getComments(id),
      getAuthorLessonCount(lesson.userId),
      currentUser ? getFavoriteStatus(id) : Promise.resolve(false),
    ]);

  return (
    <LessonDetailClient
      lesson={lesson}
      currentUser={currentUser}
      isLocked={isLocked}
      relatedByCategory={byCat}
      relatedByTone={byTone}
      initialComments={initialComments}
      authorLessonCount={authorLessonCount}
      initialFavorited={initialFavorited}
    />
  );
}
