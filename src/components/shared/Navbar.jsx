"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  BookOpen,
  PlusCircle,
  Library,
  LayoutDashboard,
  LogIn,
  UserCircle,
  LogOut,
  ChevronDown,
  House,
  Menu,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => pathname === href;

  // Role-based dashboard link
  const dashboardHref =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard";

  async function handleLogout() {
    await signOut();
    toast.success("Logged out");
    window.location.href = "/";
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  // ── Nav link component ──
  const NavLink = ({ href, label, icon, onClick }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all",
        isActive(href)
          ? "bg-white/15 text-white"
          : "text-white/50 hover:text-white hover:bg-white/10",
      )}
    >
      {icon}
      {label}
    </Link>
  );

  const publicLinks = [
    { href: "/", label: "Home", icon: <House className="h-3.5 w-3.5" /> },
    {
      href: "/lessons",
      label: "Lessons",
      icon: <BookOpen className="h-3.5 w-3.5" />,
    },
  ];

  const userLinks = [
    {
      href: "/dashboard/user/add-lesson",
      label: "Add Lesson",
      icon: <PlusCircle className="h-3.5 w-3.5" />,
    },
    {
      href: "/dashboard/user/my-lessons",
      label: "My Lessons",
      icon: <Library className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0c0c18]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-violet-600 group-hover:bg-violet-500 transition-colors">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">
              Life<span className="text-violet-400">Vault</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {publicLinks.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
            {user &&
              !isPending &&
              userLinks.map((l) => <NavLink key={l.href} {...l} />)}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2.5"> 
            {isPending ? (
              <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                {/* Upgrade button — শুধু free user এর জন্য */}
                {user.isPremium !== true && (
                  <Link
                    href="/pricing"
                    className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      boxShadow: "0 2px 12px rgba(16,185,129,0.35)",
                    }}
                  >
                    ⭐ Upgrade
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 rounded-full p-0.5 hover:ring-2 hover:ring-violet-500/40 transition-all outline-none">
                      <Avatar className="h-8 w-8 border-2 border-violet-500/40">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-violet-600 text-white text-xs font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {user.role === "admin" && (
                        <Shield className="h-3.5 w-3.5 text-amber-400" />
                      )}
                      <ChevronDown className="h-3 w-3 text-white/40" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-52 mt-2 bg-[#13131f] border-white/10 text-white"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white truncate">
                            {user.name}
                          </span>
                          {user.role === "admin" && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 shrink-0">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-white/40 truncate">
                          {user.email}
                        </span>
                        {user.isPremium && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                            ⭐ Premium Member
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem
                      asChild
                      className="focus:bg-white/10 cursor-pointer"
                    >
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4 text-white/50" />{" "}
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="focus:bg-white/10 cursor-pointer"
                    >
                      <Link
                        href={
                          user.role === "admin"
                            ? "/dashboard/admin/profile"
                            : "/dashboard/user/profile"
                        }
                        className="flex items-center gap-2"
                      >
                        <UserCircle className="h-4 w-4 text-white/50" /> Profile
                      </Link>
                    </DropdownMenuItem>

                    {user.isPremium !== true && (
                      <>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          asChild
                          className="focus:bg-emerald-500/10 cursor-pointer"
                        >
                          <Link
                            href="/pricing"
                            className="flex items-center gap-2 text-emerald-400 font-semibold"
                          >
                            ⭐ Upgrade to Premium
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Not logged in
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/signin" className="flex items-center gap-1.5">
                    <LogIn className="h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                  asChild
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-56 bg-[#0c0c18] border-white/10 text-white"
              >
                <SheetHeader>
                  <SheetTitle className="text-white text-left">
                    Life<span className="text-violet-400">Vault</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1 px-1">
                  {publicLinks.map((l) => (
                    <NavLink
                      key={l.href}
                      {...l}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                  {user &&
                    userLinks.map((l) => (
                      <NavLink
                        key={l.href}
                        {...l}
                        onClick={() => setMobileOpen(false)}
                      />
                    ))}
                  {!user && (
                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-white/60 hover:text-white"
                        asChild
                      >
                        <Link
                          href="/signin"
                          onClick={() => setMobileOpen(false)}
                        >
                          <LogIn className="h-4 w-4 mr-2" /> Login
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-violet-600 hover:bg-violet-500"
                        asChild
                      >
                        <Link
                          href="/signup"
                          onClick={() => setMobileOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                  {user && (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 mt-4 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
