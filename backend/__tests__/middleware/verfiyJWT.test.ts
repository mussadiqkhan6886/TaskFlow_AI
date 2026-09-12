import jwt from "jsonwebtoken"
import { verifyJWT } from "../../src/middleware/verifyJWT";
vi.mock("jsonwebtoken", () => ({
    default: {
        verify: vi.fn()
    }
}))

describe("verify jwt", () => {
    let req : any;
    let res : any;
    let next: any;

    beforeEach(() => {
        req = {
            cookies: {},
            user: {}
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        next = vi.fn()

        process.env.ACCESS_TOKEN = "secret"
    })


    it("Will verify jwt successfully", () => {
       
        req.cookies.accessToken = "1234"

        vi.mocked(jwt.verify).mockImplementation(
            (token, secret, callback: any) => {
                callback(null, {
                    UserInfo: {
                        id: "123",
                        username: "mk",
                        role: "Admin"
                    }
                })
            }
        )
        
        verifyJWT(req, res, next)

        expect(jwt.verify).toHaveBeenCalledWith("1234", "secret", expect.any(Function))
        expect(req.user).toEqual({
            id: "123",
            username: "mk",
            role: "Admin"
        })
        expect(next).toHaveBeenCalled()
    })

    it("Will not verify jwt and gives error of 401", () => {
        req.cookies.accessToken = ""

        verifyJWT(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Unauthorized"})
        expect(next).not.toHaveBeenCalled()
    })

    it("will not verify jwt and gives error of 403", () => {
        req.cookies.accessToken = "123",

        vi.mocked(jwt.verify).mockImplementation(
            (token, secret, callback: any) => {
                callback(new Error("Invalid token"), undefined)
            }
        )

        verifyJWT(req, res, next)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({message: "Forbidden"})
        expect(next).not.toHaveBeenCalled()
    })
    it("will not verify jwt when decoded is string and gives error of 403", () => {
        req.cookies.accessToken = "123"

        vi.mocked(jwt.verify).mockImplementation(
            (token, secret, callback: any) => {
                callback(null, 'decoded-string')
            }
        )

        verifyJWT(req, res, next)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({message: "Forbidden"})
        expect(next).not.toHaveBeenCalled()
    })
    it("will not verify jwt when decoded is undefined and gives error of 403", () => {
        req.cookies.accessToken = "123"

        vi.mocked(jwt.verify).mockImplementation(
            (token, secret, callback: any) => {
                callback(null, undefined)
            }
        )

        verifyJWT(req, res, next)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({message: "Forbidden"})
        expect(next).not.toHaveBeenCalled()
    })
})