import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/AppSidebar";
import { getSession, requireRole } from "@/lib/auth-session";
import { Shield } from "lucide-react";

export default async function UserLayout({ children }) {
  await requireRole('user');
   const session = await getSession();
   const user = session?.user;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#080810]">
        <AppSidebar user={session.user} />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Mobile top bar */}
          <header
            className="flex items-center gap-3 h-12 px-4 shrink-0 md:hidden"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              backgroundColor: "#0a0a12",
            }}
          >
            <SidebarTrigger className="text-white/50 hover:text-white h-8 w-8" />
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">
              User Panel
            </span>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
