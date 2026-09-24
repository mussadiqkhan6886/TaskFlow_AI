'use client';

import { login } from "@/server/auth";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Sparkles, ArrowLeft, Lock, User, Loader2, AlertCircle } from "lucide-react";

interface dataType {
  username: string;
  password: string;
}

const LoginPage = () => {
  const [data, setData] = useState<dataType>({
    username: "",
    password: ""
  });
  
  const router = useRouter();
  
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess() {
      router.push("/admin/dashboard");
    },
    onError(error) {
      console.error(error);
    },
  }); 

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(data);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 shadow-2xl">
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 border border-white/10">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back to TaskFlow
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Sign in to access your dashboard & AI workspace
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                value={data.username}
                onChange={handleChange}
                id="username"
                type="text"
                name="username"
                autoComplete="off"
                placeholder="Enter your username"
                required
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition "
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                autoComplete="off"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition "
              />
            </div>
          </div>

          {loginMutation.isError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginMutation.error.message || "Invalid username or password"}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-blue-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>
        </div>

      </div>
    </main>
  );
};

export default LoginPage;