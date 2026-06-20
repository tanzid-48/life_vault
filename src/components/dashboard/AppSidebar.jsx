"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Heart,
  User,
  Users,
  BookMarked,
  Flag,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const USER_NAV = [
  { icon: LayoutDashboard, href: "/dashboard/user", label: "Dashboard" },
  { icon: PlusCircle, href: "/dashboard/user/add-lesson", label: "Add Lesson" },
  { icon: BookOpen, href: "/dashboard/user/my-lessons", label: "My Lessons" },
  { icon: Heart, href: "/dashboard/user/my-favorites", label: "My Favorites" },
  { icon: User, href: "/dashboard/user/profile", label: "Profile" },
];

const ADMIN_NAV = [
  { icon: LayoutDashboard, href: "/dashboard/admin", label: "Dashboard" },
  { icon: Users, href: "/dashboard/admin/manage-users", label: "Manage Users" },
  {
    icon: BookMarked,
    href: "/dashboard/admin/manage-lessons",
    label: "Manage Lessons",
  },
  {
    icon: Flag,
    href: "/dashboard/admin/reported-lessons",
    label: "Reported Lessons",
  },
  { icon: User, href: "/dashboard/admin/profile", label: "Admin Profile" },
];

// Active link check
function isActive(pathname, href) {
  if (href === "/dashboard" || href === "/dashboard/admin")
    return pathname === href;
  return pathname.startsWith(href);
}

export default function AppSidebar({ user }) {
  const pathname = usePathname();
  const role = user?.role || "user";
  const navItems = role === "admin" ? ADMIN_NAV : USER_NAV;
  const roleLabel = role === "admin" ? "Admin Panel" : "User Panel";
  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <Sidebar className="h-screen sticky top-0 shrink-0">
      {/* Header */}
      <SidebarHeader className="p-3 border-b border-white/[0.06]">
        <div
          className="flex items-center gap-2.5 px-2 py-2 rounded-xl"
          style={{
            backgroundColor: "rgba(139,92,246,0.06)",
            border: "1px solid rgba(139,92,246,0.12)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 text-xs font-bold text-violet-400"
            style={{
              backgroundColor: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt={user?.name || "User"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">
              {roleLabel}
            </p>
            <p className="text-xs font-semibold truncate text-white/70">
              {user?.name || "User"}
            </p>
          </div>
          {role === "admin" && (
            <Shield className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          )}
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] font-bold uppercase tracking-widest px-2 mb-1 text-white/25">
            {role === "admin" ? "Administration" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="rounded-lg transition-all hover:bg-white/5 data-[active=true]:bg-violet-500/10 data-[active=true]:text-violet-300"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2.5 px-2.5 py-2"
                        style={{
                          color: active ? "#c4b5fd" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        <item.icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[13px]">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3 border-t border-white/[0.06]">
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <p className="text-[11px] text-white/35 truncate">{user?.email}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
