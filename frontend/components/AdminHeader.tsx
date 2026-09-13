'use client';

import { logout } from '@/server/auth';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'
import { FiLogOut } from 'react-icons/fi'

const AdminHeader = () => {

  const router = useRouter()
  const logoutMutation = useMutation({
    mutationFn: logout,

    onSuccess(){
      router.push("/login")
    },
  })


  return (
    <header className="bg-black text-white flex justify-between items-center p-4 ">
      <div>
        <Link href="/admin/dashboard" className="uppercase font-semibold text-lg">Admin Dashboard</Link>
      </div>
      <div>
        <button data-testid="logout" className="cursor-pointer" onClick={() => logoutMutation.mutate()}>
            <FiLogOut size={32} />
        </button>
      </div>
    </header>
  )
}

export default AdminHeader
