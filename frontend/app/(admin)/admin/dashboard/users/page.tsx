import DeleteUser from "@/components/DeleteUser";
import Search from "@/components/Search";
import { requiredRole } from "@/lib/helpers/authPage";
import { getAllUsers } from "@/server/user";
import Link from "next/link";
import React from "react";
import { Users, UserPlus, Shield, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { UserType } from "@/type";

export const dynamic = "force-dynamic";

const UsersPage = async ({ searchParams }: { searchParams: Promise<{ search?: string, status?: string }> }) => {
  const me = await requiredRole(["Manager", "Admin"]);
  
  const { search = "", status = "" } = await searchParams;
  const users: UserType[] = await getAllUsers(search, status);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-6xl space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Team Directory</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Users Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage system accounts, workspace permissions, and roles.
            </p>
          </div>

          <Link
            href="add-user"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </Link>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <Search />
        </div>

        {users.length < 1 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4 border border-slate-700/50">
              <UserCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-200">No Users Found</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              There are no user accounts matching your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {users.map((user) => {
                    const isManager = user.role === "Manager";
                    const isAdmin = user.role === "Admin";
                    const isActive = user.status === "Active";

                    return (
                      <tr
                        key={user._id}
                        className="transition-colors hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4 font-medium text-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span>{user.username}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
                              isAdmin
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                : isManager
                                ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
                              isActive
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                          >
                            {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`users/${user._id}`}
                              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition"
                            >
                              Edit
                            </Link>

                            {me.role === "Admin" && <DeleteUser id={user._id} />}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default UsersPage;