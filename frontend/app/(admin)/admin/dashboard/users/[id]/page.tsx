import EditUser from "@/components/EditUser";
import { getUser } from "@/server/user";
import React from "react";
import { UserCog, ArrowLeft } from "lucide-react";
import Link from "next/link";

const Page = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-3xl space-y-8">

        <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-6">
          <Link
            href="/admin/dashboard/users"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-blue-400 transition w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Users</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
              <UserCog className="w-3.5 h-3.5" />
              <span>Permission Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Edit User Account
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Update user information and workspace permissions.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 md:p-8 shadow-xl">
          <EditUser id={id} user={user} />
        </div>

      </div>
    </main>
  );
};

export default Page;