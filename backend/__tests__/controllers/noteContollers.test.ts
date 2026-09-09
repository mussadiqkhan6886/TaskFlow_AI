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

