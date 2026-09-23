import { fetchHelper } from "@/lib/helpers/fetchHelper"

export const getAllMessages = async (room: string) : Promise<Message[]> => {

    const response = await fetchHelper<{msgs: Message[]}>(`messages/${room}`)
    return response.msgs
}