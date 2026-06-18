"use client";

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
  Lock,
  ChevronDown,
  House,
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const USER_PLAN = "free"; // পরে API থেকে আসবে

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const isActive = (href) => pathname === href;

  const navLink = (href, label, icon) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200",
        isActive(href)
          ? "bg-white/15 text-white"
          : "text-white/50 hover:text-white hover:bg-white/10",
      )}
    >
      {icon}
      {label}
    </Link>
  );

  async function handleLogout() {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0c0c18]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ── Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 group-hover:bg-violet-500 transition-colors">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">
              Life<span className="text-violet-400">Vault</span>
            </span>
          </Link>

          {/* ── Nav Links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLink("/", "Home", <House className="h-3.5 w-3.5" />)}
            {navLink(
              "/lessons",
              "Lessons",
              <BookOpen className="h-3.5 w-3.5" />,
            )}
            {user && (
              <>
                {navLink(
                  "/dashboard/add-lesson",
                  "Add Lesson",
                  <PlusCircle className="h-3.5 w-3.5" />,
                )}
                {navLink(
                  "/dashboard/my-lessons",
                  "My Lessons",
                  <Library className="h-3.5 w-3.5" />,
                )}
              </>
            )}
          </nav>

          {/* ── Right Side */}
          <div className="flex items-center gap-2.5">
            {/* UPGRADE button — free plan + logged-in only */}
            {user && USER_PLAN === "free" && (
              <Link
                href="/pricing"
                className="hidden sm:flex items-center gap-2 rounded-full bg-green-500 hover:bg-green-400 active:scale-95 px-4 py-2 text-[13px] font-bold text-white transition-all shadow-md shadow-green-500/30"
              >
                <Lock className="h-3.5 w-3.5" />
                UPGRADE
              </Link>
            )}

            {/* Separator */}
            {user && <div className="hidden sm:block h-5 w-px bg-white/15" />}

            {isPending ? (
              <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-white/10 transition-colors outline-none">
                    <Avatar className="h-8 w-8 border-2 border-violet-500/40">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-violet-600 text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-white/80 max-w-[90px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-52 mt-1 bg-[#13131f] border-white/10 text-white"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-white truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-white/40 truncate">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    asChild
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    <Link
                      href="/dashboard/user/profile"
                      className="flex items-center gap-2"
                    >
                      <UserCircle className="h-4 w-4 text-white/50" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    <Link
                      href="/dashboard/user"
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4 text-white/50" />{" "}
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>
    </header>
  );
}
