"use client";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SuspendedSignOut() {
  const router = useRouter();
  async function handle() {
    await signOut();
    window.location.href = "/signin";
  }
  return (
    <button onClick={handle}
      className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
      style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
      <LogOut className="w-4 h-4"/> Sign Out
    </button>
  );
}