'use client';

import { deleteNote } from '@/server/note';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

const DeleteNote = ({id}: {id: string}) => {

    const router = useRouter()

    const deleteMut = useMutation({
        mutationFn: deleteNote,
        onSuccess(){
            router.refresh()
        },
        onError(error){
            alert(error.message)
        },
        
    })
  return (
    <button
        onClick={() => {
            if (window.confirm("Are you sure you want to delete this technote?")) {
                deleteMut.mutate(id);
            }
        }}
        disabled={deleteMut.isPending}
        className="inline-flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500 hover:text-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
        {deleteMut.isPending ? (
            <>
                <Loader2 className="w-3.5 h-3.5 animate-spin"/>
                <span>Deleting...</span>
            </>
        ) : (
            <>
                <Trash2 className="w-3.5 h-3.5"/>
                <span>Delete</span>
            </>
        )}
    </button>
  )
}

export default DeleteNote
