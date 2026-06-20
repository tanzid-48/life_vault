export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#080810]">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-violet-950 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-violet-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>

      {/* Loading Text */}
      <div className="mt-6 text-center">
        <h2 className="text-white font-semibold text-lg tracking-wide">
          Loading Dashboard
        </h2>
        <p className="text-slate-500 text-sm mt-1">Please wait a moment...</p>
      </div>
    </div>
  );
}
