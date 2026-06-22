"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Shield,
  Trash2,
  UserCog,
  Search,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react";
import { updateUserRole, suspendUser, deleteUser } from "@/lib/action/admin";
import { useRouter } from "next/navigation";

function ConfirmModal({
  title,
  desc,
  onConfirm,
  onCancel,
  loading,
  danger = true,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
        style={{
          backgroundColor: "#13131f",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
          style={{
            backgroundColor: danger
              ? "rgba(248,113,113,0.1)"
              : "rgba(139,92,246,0.1)",
            border: `1px solid ${danger ? "rgba(248,113,113,0.2)" : "rgba(139,92,246,0.2)"}`,
          }}
        >
          <AlertTriangle
            className="w-6 h-6"
            style={{ color: danger ? "#f87171" : "#a78bfa" }}
          />
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-sm text-white/45 mt-1.5 leading-relaxed">{desc}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-semibold transition-all hover:bg-white/10 disabled:opacity-50"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: danger
                ? "rgba(248,113,113,0.15)"
                : "rgba(139,92,246,0.15)",
              border: `1px solid ${danger ? "rgba(248,113,113,0.3)" : "rgba(139,92,246,0.3)"}`,
              color: danger ? "#f87171" : "#a78bfa",
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageUsersClient({ initialUsers }) {
    const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // { type, user }
  const [loading, setLoading] = useState(false);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleAction() {
    if (!modal) return;
    setLoading(true);
    const { type, user } = modal;
    const id = user._id?.$oid || user._id;

    let result;
    if (type === "delete") result = await deleteUser(id);
    if (type === "promote") result = await updateUserRole(id, "admin");
    if (type === "demote") result = await updateUserRole(id, "user");
    if (type === "suspend") result = await suspendUser(id, true);
    if (type === "unsuspend") result = await suspendUser(id, false);

    if (result?.success) {
      if (type === "delete") {
        setUsers((prev) => prev.filter((u) => (u._id?.$oid || u._id) !== id));
      } else {
        setUsers((prev) =>
          prev.map((u) => {
            if ((u._id?.$oid || u._id) !== id) return u;
            if (type === "promote") return { ...u, role: "admin" };
            if (type === "demote") return { ...u, role: "user" };
            if (type === "suspend") return { ...u, suspended: true };
            if (type === "unsuspend") return { ...u, suspended: false };
            return u;
          }),
        );
      }
      toast.success("Done!");
     router.refresh();
    } else {
      toast.error(result?.message || "Failed");
    }
    setLoading(false);
    setModal(null);
  }

  const MODAL_CONFIG = {
    delete: {
      title: "Delete User?",
      desc: "This user and all their lessons will be permanently deleted.",
      danger: true,
    },
    promote: {
      title: "Promote to Admin?",
      desc: "This user will gain full admin access.",
      danger: false,
    },
    demote: {
      title: "Demote to User?",
      desc: "This user will lose admin access.",
      danger: false,
    },
    suspend: {
      title: "Suspend User?",
      desc: "This user won't be able to access the platform.",
      danger: true,
    },
    unsuspend: {
      title: "Unsuspend User?",
      desc: "This user will regain access to the platform.",
      danger: false,
    },
  };

  return (
    <>
      {modal && (
        <ConfirmModal
          {...MODAL_CONFIG[modal.type]}
          onConfirm={handleAction}
          onCancel={() => setModal(null)}
          loading={loading}
        />
      )}

      {/* Search */}
      <div
        className="flex items-center gap-3 px-4 h-11 rounded-xl"
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Search className="w-4 h-4 text-white/30 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
        />
      </div>

      {/* Desktop table */}
      <div
        className="hidden md:block rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="grid px-5 py-3"
          style={{
            gridTemplateColumns: "2fr 2fr 1fr 0.8fr 0.8fr 1.5fr",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {["Name", "Email", "Role", "Lessons", "Status", "Actions"].map(
            (h) => (
              <p
                key={h}
                className="text-[10px] font-bold uppercase tracking-widest text-white/25"
              >
                {h}
              </p>
            ),
          )}
        </div>

        {filtered.map((user, i) => {
          const id = user._id?.$oid || user._id;
          const isLast = i === filtered.length - 1;
          const isAdmin = user.role === "admin";
          const isSusp = user.suspended;

          return (
            <div
              key={id}
              className="grid items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
              style={{
                gridTemplateColumns: "2fr 2fr 1fr 0.8fr 0.8fr 1.5fr",
                borderBottom: isLast
                  ? "none"
                  : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-violet-400"
                  style={{
                    backgroundColor: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.15)",
                  }}
                >
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <p className="text-sm font-semibold text-white truncate">
                  {user.name || "—"}
                </p>
              </div>

              {/* Email */}
              <p className="text-xs text-white/40 truncate">{user.email}</p>

              {/* Role */}
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full w-fit flex items-center gap-1"
                style={
                  isAdmin
                    ? {
                        backgroundColor: "rgba(251,191,36,0.08)",
                        color: "#fbbf24",
                        border: "1px solid rgba(251,191,36,0.2)",
                      }
                    : {
                        backgroundColor: "rgba(139,92,246,0.08)",
                        color: "#a78bfa",
                        border: "1px solid rgba(139,92,246,0.2)",
                      }
                }
              >
                {isAdmin && <Shield className="w-3 h-3" />}
                {isAdmin ? "Admin" : "User"}
              </span>

              {/* Lessons */}
              <p className="text-sm text-white/60 font-semibold">
                {user.lessonCount ?? 0}
              </p>

              {/* Status */}
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit"
                style={
                  isSusp
                    ? {
                        backgroundColor: "rgba(248,113,113,0.08)",
                        color: "#f87171",
                        border: "1px solid rgba(248,113,113,0.2)",
                      }
                    : {
                        backgroundColor: "rgba(52,211,153,0.08)",
                        color: "#34d399",
                        border: "1px solid rgba(52,211,153,0.2)",
                      }
                }
              >
                {isSusp ? "Suspended" : "Active"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {/* Role toggle */}
                <button
                  onClick={() =>
                    setModal({ type: isAdmin ? "demote" : "promote", user })
                  }
                  className="h-7 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all hover:bg-white/10"
                  style={{ color: isAdmin ? "#fbbf24" : "#a78bfa" }}
                >
                  <UserCog className="w-3.5 h-3.5" />
                  {isAdmin ? "Demote" : "Promote"}
                </button>

                {/* Suspend toggle */}
                <button
                  onClick={() =>
                    setModal({ type: isSusp ? "unsuspend" : "suspend", user })
                  }
                  className="h-7 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all hover:bg-white/10"
                  style={{ color: isSusp ? "#34d399" : "#fbbf24" }}
                >
                  {isSusp ? "Activate" : "Suspend"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => setModal({ type: "delete", user })}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10"
                  style={{ color: "rgba(248,113,113,0.7)" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map((user) => {
          const id = user._id?.$oid || user._id;
          const isAdmin = user.role === "admin";
          const isSusp = user.suspended;
          return (
            <div
              key={id}
              className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.018)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-violet-400 shrink-0"
                    style={{
                      backgroundColor: "rgba(139,92,246,0.08)",
                      border: "1px solid rgba(139,92,246,0.15)",
                    }}
                  >
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-white/35 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModal({ type: "delete", user })}
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 hover:bg-red-500/10"
                  style={{ color: "rgba(248,113,113,0.7)" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={
                    isAdmin
                      ? {
                          backgroundColor: "rgba(251,191,36,0.08)",
                          color: "#fbbf24",
                          border: "1px solid rgba(251,191,36,0.2)",
                        }
                      : {
                          backgroundColor: "rgba(139,92,246,0.08)",
                          color: "#a78bfa",
                          border: "1px solid rgba(139,92,246,0.2)",
                        }
                  }
                >
                  {isAdmin && <Shield className="w-3 h-3" />}
                  {isAdmin ? "Admin" : "User"}
                </span>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={
                    isSusp
                      ? {
                          backgroundColor: "rgba(248,113,113,0.08)",
                          color: "#f87171",
                          border: "1px solid rgba(248,113,113,0.2)",
                        }
                      : {
                          backgroundColor: "rgba(52,211,153,0.08)",
                          color: "#34d399",
                          border: "1px solid rgba(52,211,153,0.2)",
                        }
                  }
                >
                  {isSusp ? "Suspended" : "Active"}
                </span>
                <span className="text-[11px] text-white/35">
                  {user.lessonCount ?? 0} lessons
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setModal({ type: isAdmin ? "demote" : "promote", user })
                  }
                  className="flex-1 h-8 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    color: "#a78bfa",
                  }}
                >
                  <UserCog className="w-3.5 h-3.5" />
                  {isAdmin ? "Demote" : "Promote"}
                </button>
                <button
                  onClick={() =>
                    setModal({ type: isSusp ? "unsuspend" : "suspend", user })
                  }
                  className="flex-1 h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: isSusp
                      ? "rgba(52,211,153,0.08)"
                      : "rgba(251,191,36,0.08)",
                    border: `1px solid ${isSusp ? "rgba(52,211,153,0.2)" : "rgba(251,191,36,0.2)"}`,
                    color: isSusp ? "#34d399" : "#fbbf24",
                  }}
                >
                  {isSusp ? "Activate" : "Suspend"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
