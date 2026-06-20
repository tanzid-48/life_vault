import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  const role = session.user?.role;
  if (role === "admin") {
    redirect("/dashboard/admin");
  } else {redirect("/dashboard/user");
  }
}


