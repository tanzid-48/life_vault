import EditLessonForm from "@/components/dashboard/user/EditLessonForm";
import { getLessonById } from "@/lib/action/lessonDetail";
import { getSession } from "@/lib/auth-session";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Edit Lesson | LifeVault" };

export default async function EditLessonPage({ params }) {
  const { id } = await params;

  const [lesson, session] = await Promise.all([
    getLessonById(id),
    getSession(),
  ]);

  // ── lesson নেই
  if (!lesson) notFound();

  // ── login নেই
  if (!session)
    redirect(`/signin?redirect=/dashboard/user/my-lessons/${id}/edit`);

  const currentUserId = session.user?.id;
  const isOwner = currentUserId === lesson.userId;
  const isAdmin = session.user?.role === "admin";

  // ── owner না, admin না → unauthorized
  if (!isOwner && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.2)",
          }}
        >
          <span className="text-3xl">🔒</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-white">
            You can&apos;t edit this lesson
          </h1>
          <p className="text-sm text-white/40 mt-2">
            This lesson belongs to another user. You can only edit your own
            lessons.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/user/my-lessons"
            className="flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            <ArrowLeft className="w-4 h-4" /> My Lessons
          </Link>
          <Link
            href="/lessons"
            className="flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Browse Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 py-8 px-4">
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
        lessonId={id}
        isPremium={session.user?.isPremium === true}
      />
    </div>
  );
}
