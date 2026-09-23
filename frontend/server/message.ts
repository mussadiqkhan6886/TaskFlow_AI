import { fetchHelper } from "@/lib/helpers/fetchHelper"

export const getAllMessages = async (room: string, limit: number, pageParam: string | null) : Promise<GetMessagesResponse> => {

    const response = await fetchHelper<GetMessagesResponse>(`${pageParam ? `messages/${room}?limit=${limit}&cursor=${pageParam}` : `messages/${room}?limit=${limit}`} `)
    return response
}