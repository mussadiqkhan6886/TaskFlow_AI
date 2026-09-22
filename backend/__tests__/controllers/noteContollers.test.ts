import { ZodError } from "zod"
import { redis } from "../../src/config/connectRedis"
import { createNewNote, deleteNote, getAllNotes, getSingleNote, updateNote } from "../../src/controllers/noteControllers"
import { ROLES } from "../../src/lib/constants"
import { deleteNoteCache } from "../../src/lib/helpers/deleteCache"
import Note from "../../src/models/NoteModel"
import { noteSchema, noteUpdateSchema } from "../../src/schemas/noteSchema"

vi.mock("../../src/models/NoteModel")
vi.mock("../../src/schemas/noteSchema", () =>  ({
    noteSchema: {
        safeParse: vi.fn(),
    },
    noteUpdateSchema: {
        safeParse: vi.fn(),
    },
}))
vi.mock("../../src/lib/helpers/deleteCache", () => ({
    deleteNoteCache: vi.fn()
}))
vi.mock("../../src/config/connectRedis", () => ({
    redis: {
        get: vi.fn(),
        set: vi.fn(),
        del: vi.fn()
    }
}))

vi.mock("../../src/socket/handlers/notificationHandler", () => ({
    notificationHandler: vi.fn(),
    notificationGetter: vi.fn(),
}));

const Notes = [
    {
        title: "mk",
        _id: "123",
        description: "title desc for testing",
        status: "Pending",
        priority: "Low",
        noteFor: "456"
    }
]

describe("note controller", () => {

    let req : any;
    let res : any;

    beforeEach(() => {
        req = {
            body: {},
            query: {}
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            send: vi.fn()
        }
        vi.clearAllMocks()
    })

    it("will get all notes", async () => {
        req = {
            query: {},
            user: {
                id: "123",
                role: ROLES.ADMIN
            }
        }
        vi.mocked(redis.get).mockResolvedValue(null)

        vi.mocked(Note.find).mockReturnValue({
            lean: () => ({
                exec: vi.fn().mockResolvedValue(Notes)
            })
        } as any)

        
        await getAllNotes(req, res)

        expect(redis.get).toHaveBeenCalledWith('notes?all=true&priority=undefined&status=undefined&noteFor=123')

        expect(redis.set).toHaveBeenCalledWith('notes?all=true&priority=undefined&status=undefined&noteFor=123', JSON.stringify(Notes), {EX: 120})

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({success: true, notes: Notes})

    })

    it("will get single note successfully", async () => {
        req = {
            user: {
                id: "123",
                role: ROLES.ADMIN
            },
            params: {
                id: "456"
            }
        }

        vi.mocked(redis.get).mockResolvedValue(null)
        vi.mocked(Note.findById).mockReturnValue({
            lean: () => ({
                exec: vi.fn().mockResolvedValue(Notes[0])
            })
        } as any)

        await getSingleNote(req, res)

        expect(redis.get).toHaveBeenCalledWith('note?id=456')

        expect(redis.set).toHaveBeenCalledWith("note?id=456", JSON.stringify(Notes[0]), {EX:120})

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            note: Notes[0]
        });
    })  

    it("will not get single note if id not given and send status of 400", async () => {
          req = {
            user: {
                id: "123",
                role: ROLES.ADMIN
            },
            params: {
                id: ""
            }
        }

        await getSingleNote(req, res)

        expect(Note.findById).not.toHaveBeenCalled();

        expect(redis.get).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success:false, message:"id is required"})
    })

    it("will not get single note if note not found and send status of 404", async () => {
          req = {
            user: {
                id: "123",
                role: ROLES.ADMIN
            },
            params: {
                id: "456"
            }
        }

        vi.mocked(redis.get).mockResolvedValue(null)
        vi.mocked(Note.findById).mockReturnValue({
            lean: () => ({
                exec: vi.fn().mockResolvedValue(null)
            })
        } as any)

        await getSingleNote(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message: "No Note Found", success:false})
    })

    it("will not get single note if forbidden and send status of 403", async () => {
          req = {
            user: {
                id: "123",
                role: ROLES.EMPLOYEE
            },
            params: {
                id: "456"
            }
        }

        vi.mocked(redis.get).mockResolvedValue(null)
        vi.mocked(Note.findById).mockReturnValue({
            lean: () => ({
                exec: vi.fn().mockResolvedValue(Notes[0])
            })
        } as any)

        await getSingleNote(req, res)

        expect(redis.get).toHaveBeenCalledWith('note?id=456')

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Forbidden",
        });

        expect(redis.set).not.toHaveBeenCalled();
    })

    it("will create new note successfully ", async () => {
        req = {
            body: {
                noteFor: "123",
                title: "title",
                description: "description of title",
                priority: "Low"
            }
        }  

        vi.mocked(noteSchema.safeParse).mockReturnValue({
            success: true,
            data: {
                noteFor: "123",
                title: "title",
                description: "description of title",
                priority: "Low"
            }
        })

        vi.mocked(Note.create).mockResolvedValue({
            noteFor: "123",
            title: "title",
            description: "description of title",
            priority: "Low",
            _id: "456",
            createdAt: "09-09-2026",
            updatedAt: "09-09-2026"
        } as any)

        await createNewNote(req, res)
        expect(deleteNoteCache).toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({success: true, newNote: {
            noteFor: "123",
            title: "title",
            description: "description of title",
            priority: "Low",
            _id: "456",
            createdAt: "09-09-2026",
            updatedAt: "09-09-2026"
        }})


    })

    it("will not create new note and send status of 400", async () => {
         req = {
            body: {
                noteFor: "",
                title: "",
                description: "description of title",
                priority: "Low"
            }
        }  
        await createNewNote(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "All fields are required"})
    })

    it("will not create new note and give zod error", async () => {
         req = {
            body: {
                noteFor: 123,
                title: "title",
                description: "description of title",
                priority: "Highest"
            }
        }  

        vi.mocked(noteSchema.safeParse).mockReturnValue({
            success: false,
            error: ZodError
        } as any)

        await createNewNote(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "Zod error, please enter correct field data", error: expect.anything()})
    })

    it("will update current note successfully", async () => {
        req = {
            params: {
                id: "123"
            },
            user: {
                id: "456",
                role: ROLES.ADMIN
            },
            body: {
                title: "title changed",
                status: "Completed"
            }
        }  

        vi.mocked(noteUpdateSchema.safeParse).mockReturnValue({
            success: true,
            data: {
                title: "title changed",
                status: "Completed"
            }
        })
        
        vi.mocked(Note.findOneAndUpdate).mockResolvedValue({
            _id: "123",
            title: "title changed",
            status: "Completed",
            noteFor: "456"
        })
        
        await updateNote(req, res)

        expect(Note.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: "123" },
            {
                title: "title changed",
                status: "Completed"
            },
            {
                new: true,
                runValidators: true
            }
        )

        expect(deleteNoteCache).toHaveBeenCalled()

        expect(redis.del).toHaveBeenCalledWith(`note?id=123`)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({success: true, message: "Note updated successfully", note: { _id: "123",
            title: "title changed",
            status: "Completed",
            noteFor: "456"}})
    })
    
    it("will not update current note and send status of 400 if no id is given", async () => {
           req = {
            params: {
                id: ""
            },
            
        }
        
        await updateNote(req, res)

        expect(deleteNoteCache).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "Id is required"})
    })
    
    it("will not update current note if note is not found and send status of 404", async () => {
           req = {
            params: {
                id: "123"
            },
            user: {
                id: "456",
                role: ROLES.ADMIN
            },
            body: {
                title: "title changed",
                status: "Completed"
            }
        }  

        vi.mocked(noteUpdateSchema.safeParse).mockReturnValue({
            success: true,
            data: {
                title: "title changed",
                status: "Completed"
            }
        })
        
        vi.mocked(Note.findOneAndUpdate).mockResolvedValue(null)
        
        await updateNote(req, res)

        expect(Note.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: "123" },
            {
                title: "title changed",
                status: "Completed"
            },
            {
                new: true,
                runValidators: true
            }
        )

        expect(deleteNoteCache).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "Note not found or you don't have permission"})
    })
    it("will not update current note if zod error and send status of 400", async () => {
           req = {
            params: {
                id: "123"
            },
            user: {
                id: "456",
                role: ROLES.ADMIN
            },
            body: {
                title: "title changed",
                status: "done"
            }
            }  

        vi.mocked(noteUpdateSchema.safeParse).mockReturnValue({
            success: false,
            error: ZodError
        } as any)
        
        await updateNote(req, res)

        expect(deleteNoteCache).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "Zod error, please enter correct field data"})
    })

    it("will delete note successfully", async () => {
        req = {
            params: {
                id: "123"
            },
            user: {
                id: "456",
                role: ROLES.ADMIN
            }
        }

        vi.mocked(Note.findOneAndDelete).mockResolvedValue({
             _id: "123",
            title: "title",
            status: "Completed"
        } as any)
        await deleteNote(req, res)

         expect(Note.findOneAndDelete).toHaveBeenCalledWith({ _id: "123" })
        expect(deleteNoteCache).toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.send).toHaveBeenCalled()

    })

    it("will not delete note if note is not found and send status of 404", async () => {
        req = {
            params: {
                id: "123"
            },
            user: {
                id: "456",
                role: ROLES.ADMIN
            }
        }

        vi.mocked(Note.findOneAndDelete).mockResolvedValue(null)
        await deleteNote(req, res)

        expect(Note.findOneAndDelete).toHaveBeenCalled()
        expect(deleteNoteCache).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({success:false, message: "no note found with this id"})
    })
    it("will not delete note if id is not given and send status of 400", async () => {
        req = {
            params: {
                id: ""
            },
            user: {
                id: "456",
                role: ROLES.ADMIN
            }
        }

        vi.mocked(Note.findOneAndDelete).mockResolvedValue(null)
        await deleteNote(req, res)

        expect(deleteNoteCache).not.toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success:false, message: "Id is required"})
    })
})