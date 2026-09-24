'use client';

import { createUser } from '@/server/user';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Loader2, AlertCircle, Save, User, Mail, Lock, Shield, CheckCircle2, ChevronDown } from 'lucide-react';
import { UserType } from '@/type';

const CreateUser = () => {
  const router = useRouter();

  const createUserMut = useMutation({
    mutationFn: createUser,
    onSuccess() {
      router.push('/admin/dashboard/users');
    },
  });

  const [data, setData] = useState<Omit<UserType, "_id" | "createdAt">>({
    username: '',
    email: '',
    password: '',
    role: 'Employee',
    status: 'Active',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createUserMut.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5 text-blue-400" /> Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={data.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5 text-blue-400" /> Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5 text-blue-400" /> Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange}
          placeholder="Create password"
          required
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="role"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" /> Role
          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              value={data.role}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-10"
            >
              <option value="Employee" className="bg-slate-900 text-slate-200">Employee</option>
              <option value="Manager" className="bg-slate-900 text-slate-200">Manager</option>
              <option value="Admin" className="bg-slate-900 text-slate-200">Admin</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Status
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              value={data.status}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-10"
            >
              <option value="Active" className="bg-slate-900 text-slate-200">Active</option>
              <option value="Inactive" className="bg-slate-900 text-slate-200">Inactive</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 px-5 py-3 text-xs font-medium text-slate-300 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={createUserMut.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {createUserMut.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating User...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Create User</span>
            </>
          )}
        </button>
      </div>

      {createUserMut.isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{createUserMut.error.message}</span>
        </div>
      )}
    </form>
  );
};

export default CreateUser;