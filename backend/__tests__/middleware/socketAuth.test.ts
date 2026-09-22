import { socketAuth } from "../../src/middleware/socketAuth";
import jwt from "jsonwebtoken"

vi.mock("jsonwebtoken", () => ({
    default: {
        verify: vi.fn()
    }
}))

describe("socket auth middleware", () => {

    let socket:any;
    let next:any;


    beforeEach(() => {
        socket = {
            handshake: {
                headers: {
                    cookie: ""
                }
            }
        };

        next = vi.fn();

        vi.clearAllMocks();
    });

    it("will return if no cookie", () => {
        socketAuth(socket, next)

        expect(next).toHaveBeenCalledWith(new Error("No cookie"))
    })

    it("will return error if no access token", () => {

        socket.handshake.headers.cookie = "refreshToken=test";

        socketAuth(socket, next);

        expect(next)
            .toHaveBeenCalledWith(
                new Error("No token")
            );
    });


    it("will return socket.user successfully", () => {

        socket.handshake.headers.cookie = "accessToken=test-token";

        vi.mocked(jwt.verify)
            .mockReturnValue({
                UserInfo:{
                    id:"123",
                    username:"john",
                    role:"Admin"
                }
            } as any);

        socketAuth(socket, next)

        expect(socket.user)
            .toEqual({
                id:"123",
                username:"john",
                role:"Admin"
            });

        expect(next).toHaveBeenCalledWith()
    })
    it("will return unauthorized if jwt fails", () => {

        socket.handshake.headers.cookie =
            "accessToken=test-token";


        vi.mocked(jwt.verify)
            .mockImplementation(() => {
                throw new Error();
            });


        socketAuth(socket,next);


        expect(next)
            .toHaveBeenCalledWith(
                new Error("Unauthorized")
            );
    });
})