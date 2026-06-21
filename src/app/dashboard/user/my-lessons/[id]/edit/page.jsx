
import EditLessonForm from "@/components/dashboard/user/EditLessonForm";
import { getLessonById } from "@/lib/action/lessonDetail";
import { notFound } from "next/navigation";

export default async function EditLessonPage({ params }) {
  const { id } = await params;
  
  const result = await getLessonById(id);
console.log("Full Lesson Data:", result);
  
  if (!result) {
    notFound();
  }

 
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>
      <EditLessonForm initialData={result} />
    </div>
  );
}