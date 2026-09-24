import { getMe } from "@/server/user";
import Link from "next/link";
import { 
  FileText, 
  PlusCircle, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  User, 
  Sparkles, 
  ArrowRight,
  Terminal,
  Activity
} from "lucide-react";

const Page = async () => {
  const me = await getMe();
  const isAdminOrManager = me.role !== "Employee";

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10 overflow-hidden">
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-5xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Workspace Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Dashboard Overview
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Welcome back, <span className="font-semibold text-slate-200">{me.username}</span> 👋 Here is what is happening today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Socket.IO Live Connected</span>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Quick Actions Card (Spans 2 columns) */}
          <section className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 shadow-xl md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <span>Quick Actions</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {isAdminOrManager ? "Full Access" : "Standard Access"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              
              {/* View Technotes */}
              <Link
                href="dashboard/notes"
                className="group relative rounded-xl bg-slate-950/60 border border-slate-800/80 p-5 transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 transition-transform group-hover:scale-110">
                    <FileText className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-200 text-sm group-hover:text-white">View Technotes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Browse all project documentation & tasks</p>
                </div>
              </Link>

              {/* Admin/Manager Only Actions */}
              {isAdminOrManager && (
                <>
                  {/* Add New Technote */}
                  <Link
                    href="dashboard/add-note"
                    className="group relative rounded-xl bg-slate-950/60 border border-slate-800/80 p-5 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-purple-500/5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 transition-transform group-hover:scale-110">
                        <PlusCircle className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200 text-sm group-hover:text-white">Add New Technote</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Create a task with AI summary support</p>
                    </div>
                  </Link>

                  {/* View User Settings */}
                  <Link
                    href="dashboard/users"
                    className="group relative rounded-xl bg-slate-950/60 border border-slate-800/80 p-5 transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 transition-transform group-hover:scale-110">
                        <Users className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200 text-sm group-hover:text-white">User Management</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Manage team members and roles</p>
                    </div>
                  </Link>

                  {/* Add New User */}
                  <Link
                    href="dashboard/add-user"
                    className="group relative rounded-xl bg-slate-950/60 border border-slate-800/80 p-5 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-purple-500/5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 transition-transform group-hover:scale-110">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200 text-sm group-hover:text-white">Add New User</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Register a new team account</p>
                    </div>
                  </Link>
                </>
              )}

            </div>
          </section>

          {/* Account Profile Sidebar */}
          <aside className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                  {me.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Account</h2>
                  <p className="text-xs text-slate-400">Session Status</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5" /> Current User
                  </p>
                  <p className="font-medium text-slate-200 text-sm truncate">{me.username}</p>
                </div>

                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Role Authorization
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {me.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </main>
  );
};

export default Page;