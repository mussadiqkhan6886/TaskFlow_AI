'use client';

import { updateUser } from '@/server/user';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface Props {
    user: UserType,
    id: string
}

const EditUser = ({ id, user }: Props) => {

    const [data, setData] = useState<Required<updateUserData>>({
        username: user.username,
        email: user.email,
        id: user._id,
        status: user.status,
        role: user.role,
        password: ""
    })

    const updateMut = useMutation({
        mutationFn: updateUser,
        onSuccess(){
            router.push("/admin/dashboard/users")
        }
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target
        setData((prev) => ({ ...prev, [id]: value }))
    }

    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
         const changedData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
                if(key === "password" && value === "") {
                    return false;
                }
                return value !== user[key as keyof UserType];
            })
        );
        const res = updateMut.mutate({id, ...changedData})
    }

    return (
        <div className="rounded-2xl bg-white p-8 shadow-lg">

            <form className="space-y-6" onSubmit={handleSubmit}>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        User ID
                    </label>

                    <input
                        value={id}
                        readOnly
                        className="w-full rounded-lg border bg-gray-100 px-4 py-3 text-gray-500 outline-none"
                    />
                </div>


                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Username
                    </label>

                    <input
                        id="username"
                        type="text"
                        value={data.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                </div>


                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                </div>


                <div>
                    <label
                        htmlFor="role"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Role
                    </label>

                    <select
                        id="role"
                        value={data.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
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
                        value={data.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    >
                        <option value="Active">Active</option>
                        <option value="InActive">Inactive</option>
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
                        className="rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
                    >
                        {updateMut.isPending ? "Saving..." : "Save Changes"}
                    </button>

                </div>
            {updateMut.isError && <p>{updateMut.error.message}</p>}
            </form>

        </div>
    )
}

export default EditUser