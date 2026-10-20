import { logInDataType } from "@/type";

export const login = async (data: logInDataType) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    })

    const result = await res.json();

    if(!res.ok){
        throw new Error(result.message)
    }
    return result
}

export const logout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {method: "POST", credentials: "include"})
    return res.json()
}