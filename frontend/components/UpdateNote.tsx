'use client';

import { updateNote } from '@/server/note';
import { getUsersId } from '@/server/user';
import { socket } from '@/socket';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

const UpdateNote = ({ note, role }: { note: NoteType, role?:string }) => {

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

  useEffect(() => {
    const handleNotification = (data:{
        username:string,
        title:string
    }) => {

        toast.success(
            `${data.username} Completed ${data.title} Task`,
            {
                id:"update"
            }
        );

    };

    socket.on("notification", handleNotification);
    return () => {
        socket.off("notification", handleNotification);
    };

}, []);


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Note ID
        </label>

        <input
          value={note._id}
          readOnly
          className="w-full rounded-lg border bg-gray-100 px-4 py-3 text-gray-500 outline-none"
        />
      </div>


      {role !== "Employee" && <div>

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
            {isLoading ? "Loading users..." : "Select User"}
          </option>

          {users?.map((user) => (

            <option
              key={user._id}
              value={user._id}
            >
              {user.username}
            </option>

          ))}

        </select>

      </div>}


      <div>

        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={data.title}
          onChange={handleChange}
          placeholder="Enter note title"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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
          rows={5}
          value={data.description}
          onChange={handleChange}
          placeholder="Write note details..."
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
        />

      </div>


      <div>

        <label
          htmlFor="priority"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Priority
        </label>

        <select
          id="priority"
          name="priority"
          value={data.priority}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
        >

          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>

        </select>

      </div>


      <div>

        <label
          htmlFor="status"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Status
        </label>


        <select
          id="status"
          name="status"
          value={data.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
        >

          <option value="Pending">
            Pending
          </option>

          <option value="Working">
            Working
          </option>

          <option value="Completed">
            Completed
          </option>

        </select>

      </div>


      <div className="flex justify-end gap-4 pt-4">

        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-5 py-3 font-medium hover:bg-gray-100"
        >
          Cancel
        </button>


        <button
          type="submit"
          disabled={updateMut.isPending}
          className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
        >

          {updateMut.isPending
            ? "Saving..."
            : "Save Note"
          }

        </button>

      </div>


      {updateMut.isError && (
        <p className="text-red-500">
          {updateMut.error.message}
        </p>
      )}

    </form>
  );
};


export default UpdateNote;