"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  BookOpen,
  PlusCircle,

  LayoutDashboard,
  LogIn,
  UserCircle,
  LogOut,
  Crown,
  ChevronDown,
  House,
  Library,
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// user plan — পরে API থেকে আসবে, এখন mock
const USER_PLAN = "free"; // "free" | "pro"

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
        "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200",
        isActive(href)
          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-sm group-hover:bg-violet-700 transition-colors">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Life<span className="text-violet-600">Vault</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLink("/", "Home", <House className="h-3.5 w-3.5" />)}
            {navLink(
              "/lessons",
              "Public Lessons",
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
                {USER_PLAN === "free" && (
                  <Link
                    href="/pricing"
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200",
                      isActive("/pricing")
                        ? "bg-amber-100 text-amber-700"
                        : "text-amber-600 hover:text-amber-700 hover:bg-amber-50",
                    )}
                  >
                    <Crown className="h-3.5 w-3.5" />
                    Upgrade
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1 py-0 border-amber-300 text-amber-600 ml-0.5"
                    >
                      PRO
                    </Badge>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none">
                    <Avatar className="h-8 w-8 border-2 border-violet-200">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-violet-600 text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52 mt-1">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-slate-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/user/profile"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/user"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/signin" className="flex items-center gap-1.5">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
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
