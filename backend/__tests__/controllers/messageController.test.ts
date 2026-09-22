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

    it("will send 400 error if room is not sent", async () => {

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
