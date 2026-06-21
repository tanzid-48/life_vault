"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateLessonField } from "@/lib/action/my-lessons";

export default function EditLessonForm({ initialData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    accessLevel: initialData.accessLevel || "free",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

   
    const result = await updateLessonField(initialData._id, formData);

    if (result && result.success) {
      toast.success("Lesson updated successfully!");
      router.push("/dashboard/user/my-lessons");
    } else {
      
      toast.error(result?.message || "Failed to update");
      console.error("Update failed:", result);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-950/50 p-8 rounded-2xl border border-white/5 shadow-xl"
    >
      {/* Header: User Info (Only what we have) */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-xl border border-white/5">
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Owner
          </p>
          <p className="text-sm font-medium text-white">
            {initialData.userName || "Unknown"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Category
          </p>
          <p className="text-sm font-medium text-white">
            {initialData.category || "General"}
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <input
          required
          className="w-full p-3 bg-gray-900 border border-white/10 rounded-lg focus:border-purple-500 transition-all outline-none text-white"
          value={formData.title}
          placeholder="Lesson Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <textarea
          className="w-full p-3 bg-gray-900 border border-white/10 rounded-lg h-32 focus:border-purple-500 transition-all outline-none resize-none text-white"
          value={formData.description}
          placeholder="Description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <select
          value={formData.accessLevel}
          onChange={(e) =>
            setFormData({ ...formData, accessLevel: e.target.value })
          }
          className="w-full p-3 bg-gray-900 border border-white/10 rounded-lg focus:border-purple-500 outline-none cursor-pointer text-white"
        >
          <option value="free">Free Access</option>
          <option value="premium">Premium Access</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition-all disabled:opacity-50"
      >
        {loading ? "Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
}
