import { getAdminReports } from "@/lib/api/admin";
import ReportedLessonsClient from "./ReportedLessonsClient";

export const metadata = { title: "Reported Lessons | Admin" };

export default async function ReportedLessonsPage() {
  const reports = await getAdminReports();
  const pending = reports.filter((r) => !r.resolved).length;
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <span className="text-[10px] font-bold tracking-[3px] uppercase text-amber-400/70">
          Admin
        </span>
        <h1 className="text-2xl font-black text-white mt-0.5">
          Reported Lessons
        </h1>
        <p className="text-sm text-white/35 mt-1">
          {pending} pending · {reports.length} total
        </p>
      </div>
      <ReportedLessonsClient initialReports={reports} />
    </div>
  );
}
