import { aiGenerate } from "../../src/controllers/aiController";
import Note from "../../src/models/NoteModel";
import { aiSchema } from "../../src/schemas/aiSchema";
import { generate } from "../../src/service/geminiService";

vi.mock("../../src/schemas/aiSchema", () => ({
    aiSchema: {
        safeParse: vi.fn()
    }
}))

vi.mock("../../src/models/NoteModel", () => ({
    default: {
        findById: vi.fn()
    }
}))

vi.mock("../../src/service/geminiService", () => ({
    generate: vi.fn()
}))


describe("ai controller", () => {
    let req : any;
    let res : any;

    beforeEach(() => {
        vi.clearAllMocks()

        req = {
            body: {},
            user: {}
        }
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
    })
    it("will generate priority successfully", async () => {
        req = {
            body : {
                noteId: "",
                action: "priority",
                description: "create auth for website"
            }
        }
        
        vi.mocked(aiSchema.safeParse).mockReturnValue({
            data: req.body,
            success: true
        })

        vi.mocked(generate).mockResolvedValue("High")

        await aiGenerate(req, res)

         expect(generate).toHaveBeenCalledWith({
                action:"priority",
                content:"create auth for website"
            })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            success: true, answer: "High"
        })


    })
    it("will generate summary of note successfully", async () => {
        req = {
            body : {
                noteId: "123",
                action: "summary",
                description: ""
            }
        }
        
        vi.mocked(aiSchema.safeParse).mockReturnValue({
            data: req.body,
            success: true
        })

        vi.mocked(Note.findById)
            .mockReturnValue({
                lean(){
                    return {
                        exec: vi.fn()
                        .mockResolvedValue({
                            _id:"123",
                            description:"Create auth system",
                            noteFor:"user1"
                        })
                    }
                }
            } as any)

        vi.mocked(generate).mockResolvedValue(
            "This note is about authentication"
        )

        await aiGenerate(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            success: true, answer: "This note is about authentication"
        })

    })
    it("will not generate anything and send zod error", async () => {
        req = {
            body : {
                noteId: "123",
                action: "nothing",
                description: ""
            }
        }
        
        vi.mocked(aiSchema.safeParse).mockReturnValue({
            data: req.body,
            success: false,
            error: {
                message: "Invalid data"
            }
        }as any)

        await aiGenerate(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            success: false, message: "Zod error, please enter correct field data", error: "something went wrong"
        })
    })
    it("will give 400 error if noteId or description is not provided", async () => {
           req = {
            body : {
                noteId: "123",
                action: "",
                description: ""
            }
        }
        
        vi.mocked(aiSchema.safeParse).mockReturnValue({
            data: req.body,
            success: true,
        })

        await aiGenerate(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            success: false, message: "Provide noteId or description"
        })
    })
    it("if note is note found it will give error 404", async () => {
          req = {
            body : {
                noteId: "123",
                action: "summary",
                description: ""
            }
        }
        
        vi.mocked(aiSchema.safeParse).mockReturnValue({
            data: req.body,
            success: true
        })

        vi.mocked(Note.findById)
            .mockReturnValue({
                lean(){
                    return {
                        exec: vi.fn()
                        .mockResolvedValue(null)
                    }
                }
            } as any)
        await aiGenerate(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            success: false, answer: "Note not found"
        })
        expect(generate).not.toHaveBeenCalled()
    })
    it("will send 403 forbidden error if you are not allowed to see note", async () => {
        req = {
            body : {
                noteId: "123",
                action: "summary",
                description: ""
            },
            user: {
                id: "098",
                role: "Employee"
            }
        }
        
        vi.mocked(aiSchema.safeParse).mockReturnValue({
            data: req.body,
            success: true
        })

        vi.mocked(Note.findById)
            .mockReturnValue({
                lean(){
                    return {
                        exec: vi.fn()
                        .mockResolvedValue({
                            _id:"123",
                            description:"Create auth system",
                            noteFor:"user1"
                        })
                    }
                }
            } as any)
        await aiGenerate(req, res)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({
            success: true, answer: "Forbidden"
        })
        expect(generate).not.toHaveBeenCalled()
    })
    it("will give 503 status if ai error", async () => {
        req = {
            body : {
                noteId: "",
                action: "priority",
                description: "create auth for website"
            }
        }
        
        vi.mocked(aiSchema.safeParse).mockReturnValue({
            data: req.body,
            success: true
        })

        vi.mocked(generate).mockRejectedValue({
            status:503
        })

        await aiGenerate(req, res)

        
        expect(res.status).toHaveBeenCalledWith(503)
        expect(res.json).toHaveBeenCalledWith({
            success: true, message: "AI service is busy. Please try again"
        })
    })
})