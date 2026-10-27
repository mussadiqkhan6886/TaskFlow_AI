import { getAllMessages } from "../../src/controllers/messageControllers"
import { Message } from "../../src/models/MessageModel"

vi.mock("../../src/models/MessageModel", () => ({
    Message: {
        find: vi.fn()
    }
}))
const mockMessages = [
  {
    _id: "1",
    message: "Hello",
    room: "user-room",
  },
];
describe("message controller", () => {

    let req : any;
    let res : any;

    res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    }


    beforeEach(() => {
        vi.clearAllMocks()

        req = {};

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    })

    it("will get all messages", async () => {
        req = {
            params: {
                room: "staff-room"
            }
        }

        const populate = vi.fn().mockReturnThis();
        const sort = vi.fn().mockResolvedValue(mockMessages);

        vi.mocked(Message.find).mockReturnValue({
            populate,
            sort
        } as any);

        await getAllMessages(req, res);

        expect(Message.find).toHaveBeenCalledWith({
            room: "staff-room"
        });

        expect(populate).toHaveBeenNthCalledWith(
            1,
            "senderId",
            "username role"
        );

        expect(populate).toHaveBeenNthCalledWith(
            2,
            "readBy.readerId",
            "username role"
        );

        expect(sort).toHaveBeenCalledWith({
            createdAt: 1
        });


        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({success: true, msgs: mockMessages})
    })

    it("will get paginated messages with limit and cursor info", async () => {
        req = {
            params: {
                room: "staff-room"
            },
            query: {
                limit: "2"
            }
        }

        // Return 3 items (limit + 1) to indicate hasMore = true
        // Ordered newest to oldest as returned by sort({ _id: -1 })
        const rawFromDb = [
            { _id: "3", message: "Third (newest)", room: "staff-room" },
            { _id: "2", message: "Second", room: "staff-room" },
            { _id: "1", message: "First (oldest)", room: "staff-room" }
        ];

        const populate = vi.fn().mockReturnThis();
        const sort = vi.fn().mockReturnThis();
        const limitMock = vi.fn().mockResolvedValue(rawFromDb);

        vi.mocked(Message.find).mockReturnValue({
            populate,
            sort,
            limit: limitMock
        } as any);

        await getAllMessages(req, res);

        expect(Message.find).toHaveBeenCalledWith({
            room: "staff-room"
        });
        expect(sort).toHaveBeenCalledWith({
            _id: -1
        });
        expect(limitMock).toHaveBeenCalledWith(3); // limit + 1 = 3

        expect(res.status).toHaveBeenCalledWith(200);
        // Should slice to limit (2), and reverse to chronological order [msg2, msg3]
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            msgs: [
                { _id: "2", message: "Second", room: "staff-room" },
                { _id: "3", message: "Third (newest)", room: "staff-room" }
            ],
            hasMore: true,
            nextCursor: "2"
        });
    })

    it("will query with before cursor to fetch older messages", async () => {
        req = {
            params: {
                room: "staff-room"
            },
            query: {
                limit: "10",
                before: "507f1f77bcf86cd799439011"
            }
        }

        const rawFromDb = [
            { _id: "507f1f77bcf86cd799439010", message: "Older msg", room: "staff-room" }
        ];

        const populate = vi.fn().mockReturnThis();
        const sort = vi.fn().mockReturnThis();
        const limitMock = vi.fn().mockResolvedValue(rawFromDb);

        vi.mocked(Message.find).mockReturnValue({
            populate,
            sort,
            limit: limitMock
        } as any);

        await getAllMessages(req, res);

        expect(Message.find).toHaveBeenCalledWith(expect.objectContaining({
            room: "staff-room",
            _id: { $lt: expect.anything() }
        }));

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            msgs: [
                { _id: "507f1f77bcf86cd799439010", message: "Older msg", room: "staff-room" }
            ],
            hasMore: false,
            nextCursor: null
        });
    })

    it("will send 400 error if room is not sent", async () => {

        req = {
            params: {
                room: ""
            }
        }

        await getAllMessages(req, res);

        expect(Message.find).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "Room is required"})
    })

    it("will send 403 if forbidden", async () => {
         req = {
            params: {
                room: "staff-room"
            },
            user: {
                role: "Employee"
            }
        }

        await getAllMessages(req, res);

        expect(Message.find).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({success: false, message: "Forbidden"})
    })
})