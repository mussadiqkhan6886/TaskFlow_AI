import DeleteNote from "@/components/DeleteNote";
import NoteQuery from "@/components/NoteQuery";
import { requiredRole } from "@/lib/helpers/authPage";
import { formatDate } from "@/lib/helpers/formatDate";
import { getAllNotes } from "@/server/note";
import Link from "next/link";
import React from "react";

const NotesPage = async ({searchParams}: {searchParams: Promise<{status?:string, priority?:string}>}) => {
  
  const {status = "", priority=""} = await searchParams

  const notes : NoteType[] = await getAllNotes(status, priority)

  const me =  await requiredRole(["Employee", "Admin", "Manager"])

  
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Technotes
            </h1>

            <p className="mt-2 text-gray-500">
              View and manage all technical notes
            </p>
          </div>

          <Link href="add-note" className="rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800">
            + Add Note
          </Link>
        </div>


        <NoteQuery />


        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {notes.length < 1 ? <h2 className="text-center font-semibold text-2xl">No Notes</h2> : notes.map((note: NoteType) => (
            <div
              key={note._id}
              data-testid="note-card"
              className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1"
            >

              <div className="mb-4 flex items-start justify-between">

                <h2 className="text-xl font-semibold text-gray-900">
                  {note.title}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    note.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : note.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {note.priority}
                </span>

              </div>


              <p className="mb-5 text-sm text-gray-600">
                {note.description}
              </p>


              <div className="space-y-2 border-t pt-4 text-sm">

                <p>
                  <span className="font-medium">
                    Date:
                  </span>{" "}
                  {formatDate(note.createdAt)}
                </p>


                <p>
                  <span className="font-medium">
                    Status:
                  </span>{" "}
                  <span className="text-blue-600">
                    {note.status}
                  </span>
                </p>

              </div>


              <div className="mt-5 flex gap-3">

                <Link href={`notes/${note._id}`} className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Edit
                </Link>
                {me.role !== "Employee" && <DeleteNote id={note._id} />}
              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
};

export default NotesPage;