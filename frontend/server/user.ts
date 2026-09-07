import { fetchHelper } from "@/lib/helpers/fetchHelper"

interface me{
    _id: string
    username: string
    role: string
}

export const getMe = async () : Promise<me> => {
    const result = await fetchHelper<{user: me}>("users/me")
    return result.user
}

export const getAllUsers = async (search: string, status: string) : Promise<UserType[]> => {
    const result = await fetchHelper<{users: UserType[]}>(`users?search=${search}&status=${status}`)
    return result.users
}


export const getUser = async (id: string) : Promise<Required<UserType>> => {
    const result = await fetchHelper<{user: Required<UserType>}>(`users/${id}`)
    return result.user
    
}

export const updateUser = async (data: updateUserData) : Promise<UserType> => {
    const {id, ...newData} = data
    const result = await fetchHelper<{user: UserType}>(`users/${data.id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newData)
    })

    return result.user
}

export const createUser = async (data: Omit<UserType, "_id" | "createdAt">) : Promise<UserType> => {
    const result = await fetchHelper<{user: UserType}>("users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return result.user
}

export const deleteUser = async (id: string) : Promise<void> => {
    await fetchHelper<undefined>(`users/${id}`, {method: "DELETE"})
}


export const getUsersId = async () : Promise<UsersIdType[]> => {
    const result = await fetchHelper<{usersId: UsersIdType[]}>("users/ids")
    return result.usersId
}   