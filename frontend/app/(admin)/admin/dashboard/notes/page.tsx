import DeleteNote from "@/components/DeleteNote";
import NoteQuery from "@/components/NoteQuery";
import SummarizeButton from "@/components/SummarizeButton";
import { requiredRole } from "@/lib/helpers/authPage";
import { formatDate } from "@/lib/helpers/formatDate";
import { getAllNotes } from "@/server/note";
import Link from "next/link";
import { FileText, Plus, Calendar, CheckCircle2, AlertCircle, Sparkles, FolderOpen } from "lucide-react";
import { NoteType } from "@/type";

export const dynamic = "force-dynamic";

const NotesPage = async ({ searchParams }: { searchParams: Promise<{ status?: string, priority?: string }> }) => {
  const { status = "", priority = "" } = await searchParams;

  const notes: NoteType[] = await getAllNotes(status, priority);
  const me = await requiredRole(["Employee", "Admin", "Manager"]);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-6xl space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Documentation Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Technotes Workspace
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              View and manage technical tasks, notes, and AI summaries.
            </p>
          </div>

          {me.role !== "Employee" && (
            <Link
              href="add-note"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Technote</span>
            </Link>
          )}
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <NoteQuery />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.length < 1 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4 border border-slate-700/50">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-slate-200">No Technotes Found</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                There are no notes matching your current filter criteria or status.
              </p>
            </div>
          ) : (
            notes.map((note: NoteType) => {
              const isHighPriority = note.priority === "High";
              const isMediumPriority = note.priority === "Medium";

              return (
                <div
                  key={note._id}
                  data-testid="note-card"
                  className="group relative rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 shadow-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h2 className="text-base font-semibold text-white tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {note.title}
                      </h2>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium shrink-0 border ${
                          isHighPriority
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : isMediumPriority
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {isHighPriority && <AlertCircle className="w-3 h-3" />}
                        {note.priority}
                      </span>
                    </div>

                    <p className="mb-6 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {note.description}
                    </p>
                  </div>

                  <div>
                    {/* Metadata Details */}
                    <div className="space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" /> Date:
                        </span>
                        <span className="font-mono text-slate-300 text-[11px]">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Status:
                        </span>
                        <span className="font-medium text-blue-400 capitalize">
                          {note.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`notes/${note._id}`}
                          className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-medium text-slate-200 transition"
                        >
                          Edit
                        </Link>
                        {me.role !== "Employee" && <DeleteNote id={note._id} />}
                      </div>

                      <div className="shrink-0">
                        <SummarizeButton noteId={note._id} action="summary" description="" />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </main>
  );
};

export default NotesPage;