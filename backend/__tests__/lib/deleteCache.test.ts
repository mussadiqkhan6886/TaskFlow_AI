
import { redis } from "../../src/config/connectRedis"
import {
    deleteCacheByPattern,
    deleteUserCache,
    deleteNoteCache
} from "../../src/lib/helpers/deleteCache"


vi.mock("../../src/config/connectRedis", () => ({
    redis: {
        scanIterator: vi.fn(),
        del: vi.fn()
    }
}))


describe("delete cache helper", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })


    it("should delete cache keys matching pattern", async () => {
    const iterator = (async function* () {
        yield ["users?status=Active", "users?status=InActive"]
    })()

    vi.mocked(redis.scanIterator).mockReturnValue(iterator as any)

    await deleteCacheByPattern("users*")

    expect(redis.scanIterator).toHaveBeenCalledWith({ MATCH: "users*" })
    expect(redis.del).toHaveBeenCalledWith([
        "users?status=Active",
        "users?status=InActive"
    ])
})

it("should delete user cache using users pattern", async () => {
    const iterator = (async function* () {
        yield ["users?status=Active"]
    })()

    vi.mocked(redis.scanIterator).mockReturnValue(iterator as any)

    await deleteUserCache()

    expect(redis.scanIterator).toHaveBeenCalledWith({ MATCH: "users*" })
    expect(redis.del).toHaveBeenCalledWith(["users?status=Active"])
})

it("should delete note cache using notes pattern", async () => {
    const iterator = (async function* () {
        yield ["notes?page=1"]
    })()

    vi.mocked(redis.scanIterator).mockReturnValue(iterator as any)

    await deleteNoteCache()

    expect(redis.scanIterator).toHaveBeenCalledWith({ MATCH: "notes*" })
    expect(redis.del).toHaveBeenCalledWith(["notes?page=1"])
})

it("should handle multiple cache keys", async () => {
    const iterator = (async function* () {
        yield ["notes?page=1", "notes?page=2", "notes?page=3"]
    })()

    vi.mocked(redis.scanIterator).mockReturnValue(iterator as any)

    await deleteCacheByPattern("notes*")

    expect(redis.del).toHaveBeenCalledTimes(1)
    expect(redis.del).toHaveBeenCalledWith([
        "notes?page=1",
        "notes?page=2",
        "notes?page=3"
    ])
})

})