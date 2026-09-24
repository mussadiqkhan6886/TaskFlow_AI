'use client';

import { generateAi } from '@/server/ai';
import { createNote } from '@/server/note';
import { getUsersId } from '@/server/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { HiLightningBolt } from 'react-icons/hi';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Save, User, FileText, Tag, BarChart2, ChevronDown } from 'lucide-react';
import { NoteType } from '@/type';

const CreateNote = () => {
  const router = useRouter();

  const createNoteMut = useMutation({
    mutationFn: createNote,
    onSuccess() {
      router.push('/admin/dashboard/notes');
    },
  });

  const UsersId = useQuery({
    queryKey: ["usersId"],
    queryFn: getUsersId,
    staleTime: 5 * 60 * 1000
  });

  const generatePriority = useMutation({
    mutationFn: () => generateAi({ action: "priority", noteId: "", description: data.description }),
    onSuccess: (resData) => {
      toast.success("Priority Generated", { id: "ai" });
      setData(prev => ({ ...prev, priority: resData as "High" | "Medium" | "Low" }));
    },
    onMutate: () => {
      toast.loading("AI is analyzing priority...", { id: "ai" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "ai" });
    }
  });

  const [data, setData] = useState<Omit<NoteType, "_id" | "createdAt" | "status">>({
    noteFor: '',
    title: '',
    description: '',
    priority: 'Medium',
  });

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createNoteMut.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div>
        <label
          htmlFor="noteFor"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5 text-blue-400" /> Note For (Assignee)
        </label>
        <div className="relative">
          <select
            id="noteFor"
            name="noteFor"
            value={data.noteFor}
            onChange={handleChange}
            required
            className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-10"
          >
            <option value="" className="bg-slate-900 text-slate-400">
              {UsersId.isLoading ? "Loading users..." : "Select User"}
            </option>
            {UsersId.data?.map((item) => (
              <option key={item._id} value={item._id} className="bg-slate-900 text-slate-200">
                {item.username}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" /> Note Title
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
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
        >
          <Tag className="w-3.5 h-3.5 text-blue-400" /> Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          value={data.description}
          onChange={handleChange}
          placeholder="Write your note details..."
          required
          className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="priority"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5 text-amber-400" /> Priority
          </label>
          <button
            type="button"
            onClick={() => generatePriority.mutate()}
            disabled={generatePriority.isPending || !data.description.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-[length:300%_100%] px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:animate-[gradient_2s_linear_infinite] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {generatePriority.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <HiLightningBolt size={15} />
            )}
            <span>{generatePriority.isPending ? "Generating..." : "AI Generate Priority"}</span>
          </button>
        </div>

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
          disabled={createNoteMut.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {createNoteMut.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Note...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Create Note</span>
            </>
          )}
        </button>
      </div>

      {createNoteMut.isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{createNoteMut.error.message}</span>
        </div>
      )}
    </form>
  );
};

export default CreateNote;