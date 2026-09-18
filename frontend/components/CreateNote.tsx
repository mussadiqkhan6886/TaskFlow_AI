'use client';

import { createNote } from '@/server/note';
import { getUsersId } from '@/server/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { HiLightningBolt } from 'react-icons/hi';

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
  })


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
            className="mb-2 block text-sm font-medium text-gray-700"
        >
            Note For
        </label>

        <select
            id="noteFor"
            name="noteFor"
            value={data.noteFor}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
        >
            <option value="">
            Select User
            </option>

            {UsersId.data?.map((item) => (
            <option key={item._id} value={item._id}>
                {item.username}
            </option>
            ))}
        </select>
        </div>
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Note Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={data.title}
          onChange={handleChange}
          placeholder="Enter note title"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={6}
          value={data.description}
          onChange={handleChange}
          placeholder="Write your note details..."
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <label
          htmlFor="priority"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Priority
          <button
            className="my-1 cursor-pointer relative flex items-center gap-2 overflow-hidden rounded-lg bg-[linear-gradient(90deg,#f59e0b,#ef4444,#f97316,#f59e0b)] bg-[length:300%_100%] px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:animate-[gradient_2s_linear_infinite] hover:shadow-[0_0_35px_rgba(245,158,11,.5)] active:scale-95">
            <HiLightningBolt
              size={18}
            />
            Generate 
          </button>
        </label>

        <select
          id="priority"
          name="priority"
          value={data.priority}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-5 py-3 font-medium transition hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={createNoteMut.isPending}
          className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createNoteMut.isPending ? 'Creating Note...' : 'Create Note'}
        </button>
      </div>

      {createNoteMut.isError && (
        <p className="text-red-500">{createNoteMut.error.message}</p>
      )}
    </form>
  );
};

export default CreateNote;