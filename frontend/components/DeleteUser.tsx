'use client';

import { deleteUser } from '@/server/user';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react'

const DeleteUser = ({id}: {id:string}) => {

    const router = useRouter()
    const deleteMutation = useMutation({
        mutationFn: () => deleteUser(id),

        onSuccess(){
            router.refresh()
        },
        onError(err){
            alert(err.message)
        }
    })
  return (
    <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} className="disabled:opacity:70 text-sm font-medium text-red-600 hover:underline">
        {deleteMutation.isPending ? "Deleting..." : "Delete"}
    </button>
  )
}

export default DeleteUser
