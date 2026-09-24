'use client';

import { updateUser } from '@/server/user';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Loader2, AlertCircle, Save, User, Mail, Lock, Shield, CheckCircle2, ChevronDown } from 'lucide-react';
import { updateUserData, UserType } from '@/type';

interface Props {
    user: UserType;
    id: string;
}

const EditUser = ({ id, user }: Props) => {
    const router = useRouter();

    const [data, setData] = useState<Required<updateUserData>>({
        username: user.username,
        email: user.email,
        id: user._id,
        status: user.status,
        role: user.role,
        password: ""
    });

    const updateMut = useMutation({
        mutationFn: updateUser,
        onSuccess() {
            router.push("/admin/dashboard/users");
        }
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const changedData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
                if(key === "password" && value === "") {
                    return false;
                }
                return value !== user[key as keyof UserType];
            })
        );
        updateMut.mutate({ id, ...changedData });
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    User ID
                </label>
                <input
                    value={id}
                    readOnly
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-xs font-mono text-slate-500 outline-none select-none"
                />
            </div>

            <div>
                <label
                    htmlFor="username"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
                >
                    <User className="w-3.5 h-3.5 text-blue-400" /> Username
                </label>
                <input
                    id="username"
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
                    type="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
                >
                    <Lock className="w-3.5 h-3.5 text-blue-400" /> Password (Leave blank to keep current)
                </label>
                <input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
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
                            value={data.status}
                            onChange={handleChange}
                            className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-10"
                        >
                            <option value="Active" className="bg-slate-900 text-slate-200">Active</option>
                            <option value="InActive" className="bg-slate-900 text-slate-200">Inactive</option>
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
                    disabled={updateMut.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {updateMut.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>

            {updateMut.isError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{updateMut.error.message}</span>
                </div>
            )}
        </form>
    );
};

export default EditUser;