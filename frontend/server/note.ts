import { fetchHelper } from "@/lib/helpers/fetchHelper"

export const getAllNotes = async (priority?:string, status?: string) : Promise<NoteType[]> => {
    const result = await fetchHelper<{notes: NoteType[]}>(`notes?priority=${priority}&status=${status}`)
    return result.notes
}


export const getNote = async (id: string) : Promise<NoteType> => {
    const result = await fetchHelper<{note: NoteType}>(`notes/${id}`)
    return result.note
    
}

export const updateNote = async (data: updateNoteData) : Promise<NoteType> => {
    const result = await fetchHelper<{note: NoteType}>(`notes/${data.id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return result.note
}

export const createNote = async (data: Omit<NoteType, "_id" | "createdAt" | "status">) : Promise<NoteType> => {
    const result = await fetchHelper<{note: NoteType}>("notes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return result.note
}

export const deleteNote = async (id: string) : Promise<void> => {
    await fetchHelper<undefined>(`notes/${id}`, {method: "DELETE"})
}
