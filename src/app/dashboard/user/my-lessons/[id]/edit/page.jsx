import { getLessonById } from "@/lib/action/lessonDetail";
import { getSession } from "@/lib/auth-session";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditLessonForm from "@/components/dashboard/user/EditLessonForm";

export const metadata = { title: "Edit Lesson | LifeVault" };

export default async function EditLessonPage({ params }) {
  const { id } = await params;

  const [session, lesson] = await Promise.all([
    getSession(),
    getLessonById(id),
  ]);

  if (!session) redirect("/signin");
  if (!lesson) notFound();
  const isOwner = session.user?.id === lesson.userId;
  const isAdmin = session.user?.role === "admin";
  if (!isOwner && !isAdmin) redirect("/unauthorized");

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/dashboard/user/my-lessons"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Lessons
      </Link>

      <div>
        <span className="text-[10px] font-bold tracking-[3px] uppercase text-violet-400/70">
          Edit
        </span>
        <h1 className="text-2xl font-black text-white mt-0.5">Update Lesson</h1>
        <p className="text-sm text-white/35 mt-1">
          Changes will be reflected immediately.
        </p>
      </div>

      <EditLessonForm
        initialData={lesson}
        isPremium={session.user?.isPremium === true}
      />
    </div>
  );
}
