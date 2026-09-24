'use client';

import { updateNote } from '@/server/note';
import { getUsersId } from '@/server/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Loader2, AlertCircle, Save, X, ChevronDown, User, FileText, Tag, BarChart2 } from 'lucide-react';
import { NoteType } from '@/type';
import { generateAi } from '@/server/ai';
import { toast } from 'sonner';
import { HiLightningBolt } from 'react-icons/hi';
import PriorityGenAI from './PriorityGenAI';

const UpdateNote = ({ note, role }: { note: NoteType, role?: string }) => {
  const {
    data: users,
    isLoading
  } = useQuery({
    queryKey: ["usersId"],
    queryFn: getUsersId,
    staleTime: 5 * 60 * 1000
  });

  const router = useRouter();

  const [data, setData] = useState({
    noteFor: note.noteFor.toString(),
    title: note.title,
    description: note.description,
    priority: note.priority,
    status: note.status,
  });

  const updateMut = useMutation({
    mutationFn: updateNote,
    onSuccess() {
      router.push("/admin/dashboard/notes");
    }
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateMut.mutate({
      id: note._id,
      ...data
    });
  };

  const generatePriority = useMutation({
      mutationFn: () => generateAi({action: "priority", noteId: "", description: data.description}),
      onSuccess: (data) => {
        toast.success("Priority Generated", {id: "ai"})
        setData(prev => ({...prev, priority:data as "High" | "Medium" | "Low"}))
      },
      onMutate: () => {
        toast.loading("Ai is thinking...", {id: "ai"})
      },
      onError: (error) => {
        toast.error(error.message, {id: "ai"})
      }
    })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Note ID
        </label>
        <input
          value={note._id}
          readOnly
          className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-xs font-mono text-slate-500 outline-none select-none"
        />
      </div>

      {role !== "Employee" && (
        <div>
          <label
            htmlFor="noteFor"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-blue-400" /> Note For (Assignee)
          </label>
          <div className="relative">
            <select
              id="noteFor"
              name="noteFor"
              value={data.noteFor}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-10"
            >
              <option value="" className="bg-slate-900 text-slate-300">
                {isLoading ? "Loading users..." : "Select User"}
              </option>
              {users?.map((user) => (
                <option key={user._id} value={user._id} className="bg-slate-900 text-slate-200">
                  {user.username}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" /> Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={data.title}
          onChange={handleChange}
          placeholder="Enter note title"
          required
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
        >
          <Tag className="w-3.5 h-3.5 text-blue-400" /> Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={data.description}
          onChange={handleChange}
          placeholder="Write note details..."
          required
          className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label
            htmlFor="priority"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5 text-amber-400" /> Priority
            <PriorityGenAI mutate={generatePriority.mutate} isPending={generatePriority.isPending} description={data.description} />
          </label>
          <div className="relative">
            <select
              id="priority"
              name="priority"
              value={data.priority}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-10"
            >
              <option value="Low" className="bg-slate-900 text-slate-200">Low</option>
              <option value="Medium" className="bg-slate-900 text-slate-200">Medium</option>
              <option value="High" className="bg-slate-900 text-slate-200">High</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" /> Status
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              value={data.status}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-10"
            >
              <option value="Pending" className="bg-slate-900 text-slate-200">Pending</option>
              <option value="Working" className="bg-slate-900 text-slate-200">Working</option>
              <option value="Completed" className="bg-slate-900 text-slate-200">Completed</option>
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
              <span>Save Note</span>
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

export default UpdateNote;