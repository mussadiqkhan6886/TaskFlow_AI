import { fetchHelper } from "@/lib/helpers/fetchHelper"
import { createNote, deleteNote, getAllNotes, getNote, updateNote } from "@/server/note"

vi.mock("@/lib/helpers/fetchHelper", () => ({
    fetchHelper: vi.fn()
}))

const Notes = [
    {
        noteFor: "123",
        _id: "456",
        title: "crud",
        description: "desc of crud note",
        status: "Completed",
        priority: "Low"
    }
]
describe("note server functions", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("will get all notes successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            notes: Notes   
        })

        const result = await getAllNotes("High", "Pending")

        expect(fetchHelper)
        .toHaveBeenCalledWith(
            "notes?priority=High&status=Pending"
        )
        expect(result).toEqual(Notes)
    })

    it("will get single note successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            note: Notes[0]   
        })

        const result = await getNote('456')

        expect(fetchHelper)
        .toHaveBeenCalledWith(
            "notes/456"
        )
        expect(result).toEqual(Notes[0])
    })

    it("will update note successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            note: {
                noteFor: "123",
                _id: "456",
                title: "testing",
                description: "desc of crud note",
                status: "Pending",
                priority: "High"
            }
        })

        const result = await updateNote({
                noteFor: "123",
                id: "456",
                title: "testing",
                description: "desc of crud note",
                status: "Pending",
                priority: "High"
            })
        
        expect(fetchHelper).toHaveBeenCalledWith("notes/456", {
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            noteFor:"123",
            id:"456",
            title:"testing",
            description:"desc of crud note",
            status:"Pending",
            priority:"High"
        })
    })

        expect(result).toEqual({
                noteFor: "123",
                _id: "456",
                title: "testing",
                description: "desc of crud note",
                status: "Pending",
                priority: "High"
        })
    })

    it("will create new note successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            note: {
                noteFor: "456",
                _id: "789",
                title: "new title",
                description: "new desc of note",
                status: "Pending",
                priority: "High"
            }
        })

        const result = await createNote(
            {
                noteFor: "456",
                title: "new title",
                description: "new desc of note",
                priority: "High"
            }
        )

        expect(fetchHelper).toHaveBeenCalledWith("notes", {
        method: "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            noteFor: "456",
            title: "new title",
            description: "new desc of note",
            priority: "High"
        })
    })

        expect(result).toEqual({
                noteFor: "456",
                _id: "789",
                title: "new title",
                description: "new desc of note",
                status: "Pending",
                priority: "High"
            })
    })

    it("will delete note successfully", async () => {
        vi.mocked(fetchHelper).mockResolvedValue(undefined)

        const result = await deleteNote("123")
        expect(fetchHelper).toHaveBeenCalledWith("notes/123", {
        method:"DELETE"
    })
        expect(result).toEqual(undefined)
    })

    it("will not get single note and gives error", async () => {
        vi.mocked(fetchHelper).mockRejectedValue(
            new Error("No Note Found")  
        )

        await expect(
            getNote("123")
        ).rejects.toThrow("No Note Found")

        expect(fetchHelper)
        .toHaveBeenCalledWith(
            "notes/123"
        )
    })

    it("will not update note and gives error", async () => {
        vi.mocked(fetchHelper).mockRejectedValue(new Error("something went wrong"))

        await expect(updateNote({
                noteFor: "123",
                id: "456",
                title: "testing",
                description: "desc of crud note",
                status: "Pending",
                priority: "High"
            })).rejects.toThrow("something went wrong")

        expect(fetchHelper).toHaveBeenCalledWith("notes/456", {
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            noteFor:"123",
            id:"456",
            title:"testing",
            description:"desc of crud note",
            status:"Pending",
            priority:"High"
        })
    })

        
    })

    it("will not create new note and gives error", async () => {
        vi.mocked(fetchHelper).mockRejectedValue(new Error("something went wrong"))
        await expect(createNote(
            {
                noteFor: "456",
                title: "new title",
                description: "new desc of note",
                priority: "High"
            }
        )).rejects.toThrow("something went wrong")

        expect(fetchHelper).toHaveBeenCalledWith("notes",     {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            noteFor: "456",
                title: "new title",
                description: "new desc of note",
                priority: "High"
        })
    }
)

    })

    it("will not delete note and gives error", async () => {
        vi.mocked(fetchHelper).mockRejectedValue(new Error ("something went wrong"))

        await expect(deleteNote("123")).rejects.toThrow("something went wrong")
        expect(fetchHelper).toHaveBeenCalledWith("notes/123", {
        method:"DELETE"
        })
    })
})