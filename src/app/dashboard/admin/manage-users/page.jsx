import { getAdminUsers } from "@/lib/api/admin";
import ManageUsersClient from "./ManageUsersClient";

export const metadata = { title: "Manage Users | Admin" };

export default async function ManageUsersPage() {
  const users = await getAdminUsers();
  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div>
        <span className="text-[10px] font-bold tracking-[3px] uppercase text-amber-400/70">Admin</span>
        <h1 className="text-2xl font-black text-white mt-0.5">Manage Users</h1>
        <p className="text-sm text-white/35 mt-1">{users.length} registered users</p>
      </div>
      <ManageUsersClient initialUsers={users}/>
    </div>
  );
}