import UpdateNote from "@/components/UpdateNote";
import { getNote } from "@/server/note";
import { getMe } from "@/server/user";
import React from "react";

const Page = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const note = await getNote(id)
   const me = await getMe()

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Note
          </h1>

          <p className="mt-2 text-gray-500">
            Update technical note information
          </p>
        </div>


        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <UpdateNote note={note} role={me.role} />

        </div>

      </div>
    </main>
  );
};

export default Page;