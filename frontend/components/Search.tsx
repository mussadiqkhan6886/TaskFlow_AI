'use client';

import useDebounce from '@/hooks/useDebounce';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Search as SearchIcon, ChevronDown, Filter } from 'lucide-react';

const Search = () => {
  const router = useRouter();
  const params = useSearchParams();
  
  const [search, setSearch] = useState(params.get("search") || "");
  const debouncedValue = useDebounce(search);

  useEffect(() => {
    const searchParams = new URLSearchParams(params.toString());

    if (debouncedValue) {
        searchParams.set("search", debouncedValue);
    } else {
        searchParams.delete("search");
    }

    router.push(`/admin/dashboard/users?${searchParams.toString()}`);
  }, [debouncedValue]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    query: string
  ) => {
    const { value } = e.target;
    const searchParams = new URLSearchParams(params.toString());

    if (value) {
      searchParams.set(query, value);
    } else {
      searchParams.delete(query);
    }

    router.push(`/admin/dashboard/users?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="relative flex-1 w-full">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <SearchIcon className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          autoComplete="off"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 hidden lg:flex">
          <Filter className="w-3.5 h-3.5" />
          <span>Status:</span>
        </div>

        <div className="relative w-full sm:w-44">
          <select
            defaultValue={params.get('status') ?? ''}
            onChange={(e) => handleChange(e, 'status')}
            className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs font-medium text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-10"
          >
            <option value="" className="bg-slate-900 text-slate-300">All Status</option>
            <option value="Active" className="bg-slate-900 text-slate-300">Active</option>
            <option value="InActive" className="bg-slate-900 text-slate-300">InActive</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default Search;