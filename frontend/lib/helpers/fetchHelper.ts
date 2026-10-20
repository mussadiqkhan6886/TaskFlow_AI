'use server'
import { cookies } from "next/headers"

export const fetchHelper = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
    const cookiesStore = await cookies()
    const token = cookiesStore.toString()

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${path}`, {
        ...options,
        headers: { Cookie: token, ...(options.headers || {}) },
    })

    if(res.status === 204){
        return undefined as T
    }

    const result = await res.json()
   if (!res.ok) {
        throw new Error(
            result.message ||
            result.error?.message ||
            "Something went wrong"
        )
    }
    return result
}