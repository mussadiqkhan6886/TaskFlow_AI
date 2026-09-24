'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const NoteQuery = () => {
  const router = useRouter();
  const params = useSearchParams();

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement>,
    query: string
  ) => {
    const { value } = e.target;
    const searchParams = new URLSearchParams(params);

    if (value) {
      searchParams.set(query, value);
    } else {
      searchParams.delete(query);
    }

    router.push(
      `/admin/dashboard/notes?${searchParams.toString()}`
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Filter className="w-4 h-4 text-blue-400" />
        <span>Filters:</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-48">
          <select
            value={params.get("priority") ?? ""}
            onChange={(e) => handleChange(e, "priority")}
            className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 pr-10 text-xs text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-400">All Priority</option>
            <option value="High" className="bg-slate-900 text-slate-200">High</option>
            <option value="Medium" className="bg-slate-900 text-slate-200">Medium</option>
            <option value="Low" className="bg-slate-900 text-slate-200">Low</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        <div className="relative w-full sm:w-48">
          <select
            value={params.get("status") ?? ""}
            onChange={(e) => handleChange(e, "status")}
            className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 pr-10 text-xs text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-400">All Status</option>
            <option value="Completed" className="bg-slate-900 text-slate-200">Completed</option>
            <option value="Working" className="bg-slate-900 text-slate-200">Working</option>
            <option value="Pending" className="bg-slate-900 text-slate-200">Pending</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default NoteQuery;