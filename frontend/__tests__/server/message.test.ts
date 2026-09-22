import { fetchHelper } from "@/lib/helpers/fetchHelper"
import { getAllMessages } from "@/server/message"

vi.mock("@/lib/helpers/fetchHelper", () => ({
    fetchHelper: vi.fn()
}))

const mockMessages: Message[] = [
    {
        _id: "66f123abc001",
        message: "Hello team, meeting is scheduled at 5 PM.",
        room: "staff-room",

        senderId: {
            _id: "66f123user001",
            username: "admin",
            role: "Admin",
        },

        sender: {
            id: "66f123user001",
            username: "admin",
            role: "Admin",
        },

        readBy: [
            {
                readerId: {
                    _id: "66f123user002",
                    username: "manager",
                },
                readAt: "2026-09-22T10:30:00.000Z",
            },
        ],

        createdAt: "2026-09-22T10:00:00.000Z",
    },
];

describe("get all messages server function", () => {

    it("will fetch messages successfully", async () => {

        vi.mocked(fetchHelper).mockResolvedValue({
            success: true,
            msgs:mockMessages
        })

        const result = await getAllMessages("staff-room")

        expect(fetchHelper).toHaveBeenCalledWith('messages/staff-room')
        expect(result).toEqual(mockMessages)
    })
})