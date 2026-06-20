import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white p-6">
      <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 max-w-md w-full">
        <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>
        <p className="text-slate-400 mb-8">
          It looks like you cancelled the payment process. Your account remains
          on the Free plan. You can upgrade whenever you are ready!
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 py-3 rounded-xl font-bold transition-all"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 py-3 rounded-xl font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
