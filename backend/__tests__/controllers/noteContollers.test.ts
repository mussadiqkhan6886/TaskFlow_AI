vi.mock("../models/NoteModel")
vi.mock("../schemas/noteSchema", () =>  ({
    noteSchema: vi.fn()
}))
vi.mock("../schemas/noteSchema", () =>  ({
    noteUpdateSchema: vi.fn()
}))
vi.mock("../lib/helpers/deleteCache", () => ({
    deleteNoteCache: vi.fn()
}))
vi.mock("../config/connectRedis", () => ({
    redis: vi.fn()
}))

describe("note controller", () => {

    it("will get all notes", () => {

    })

    it("will get single note", () => {
        
    })

    it("will not get single note and send status of 400", () => {

    })

    it("will create new note successfully ", () => {
        
    })

    it("will not create new note and send status of 400", () => {
        
    })

    it("will update current note successfully", () => {
        
    })
    
    it("will not update current note and send status of 400", () => {

    })
    
    it("will not update current note if note is not found and send status of 404", () => {

    })

    it("will delete note successfully", () => {
        
    })

    it("will not delete note if id is not given and  send status of 400", () => {

    })
    it("will not delete note if note is not found and send status of 404", () => {

    })
})