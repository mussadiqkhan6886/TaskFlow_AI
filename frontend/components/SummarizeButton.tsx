'use client';

import { PropsAI, summarizeNote } from '@/server/ai';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi'
import ReactMarkdown from "react-markdown"
import { toast } from 'sonner';

const SummarizeButton = ({action, noteId, description}: PropsAI) => {
    const data = useMutation({
        mutationFn: () => summarizeNote({action, noteId, description}),
        onError: (error) => {
            toast.error(error.message, {
                id: "ai"
            })
        },
        onSuccess: () => {
            setCloseSummary(true)
            toast.success(
                "Summary generated",
                {
                    id:"ai"
                }
            );
        },
        onMutate: () => {
            toast.loading("Ai is thinking...", {
                id: "ai"
            })
        }
    })
    const [closeSummary, setCloseSummary] = useState(false)
  return (
    <>
    {closeSummary && data.isSuccess && <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
        <div className="bg-white relative p-10 rounded-lg">
            <FiX onClick={() => setCloseSummary(false)} className="absolute top-3 right-4 cursor-pointer"/>
            <ReactMarkdown>
                {data.data}
            </ReactMarkdown>
        </div>
    </div>}
    <button
        onClick={() => data.mutate()}
        disabled={data.isPending}
        className="
        disabled:opacity-40
        rounded-lg
        bg-[linear-gradient(90deg,#7c3aed,#ec4899,#06b6d4,#7c3aed)]
        bg-[length:300%_100%]
        px-4
        py-2
        text-white
        transition-all
        duration-300
        hover:animate-[gradient_2s_linear_infinite]
        hover:shadow-[0_0_35px_rgba(168,85,247,.5)]
        cursor-pointer relative  flex items-center gap-2
        "
    >
        <HiSparkles size={18} className={data.isPending ? "animate-spin" : ""} />
        {data.isPending 
                    ? "Summarizing..." 
                    : "Summarize"
                }
    </button>
    </>
  )
}

export default SummarizeButton
