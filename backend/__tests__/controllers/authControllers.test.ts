import { login } from "../../src/controllers/authControllers"
import User from "../../src/models/UserModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

vi.mock("../../src/models/userModel",()=>({
    default:{
        findOne: vi.fn()
    }
}))

vi.mock("bcryptjs")
vi.mock("jsonwebtoken")

describe("auth controllers" , () => {
    let res : any
    let req : any
    beforeEach(() => {
        req =  {
            body: {}
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn()
        }

        vi.clearAllMocks()
    })

    it("shall return status of 400 when username and password is not entered", async () => {
        req.body = {}

        await login(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message: "Please Enter both username and password"})
    })

    it("shall return status of 404 when user is not found", async () => {
        req.body = {
            username: "mk",
            password: "mk123"
        }

        vi.mocked(User.findOne).mockReturnValue({
            lean: () => ({
                exec: vi.fn().mockResolvedValue(null)
            })

        }as any) 
        await login(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message: "No username found with this username or he is inactive"})
    })

    it("shall return status of 404 when user is inactive" , async () => {
        req.body = {
            username: "mk",
            password: "mk123"
        }

        vi.mocked(User.findOne).mockReturnValue({
            lean: () => ({
                exec: vi.fn().mockResolvedValue({
                    username: "mk",
                    status: "InActive",
                    email: "mk@gmail.com",
                    admin: "Admin"
                })
            })
         } as any)

         await login(req, res)

         expect(res.status).toHaveBeenCalledWith(404)
         expect(res.json).toHaveBeenCalledWith({message: "No username found with this username or he is inactive"})
    })

    it("shall return status of 401 when password is wrong", async () => {
        req.body = {
            username: "mk",
            password: "mk123"
        }

        vi.mocked(User.findOne).mockReturnValue({
            lean: () => ({
                exec: vi.fn().mockResolvedValue({
                    username: "mk",
                    status: "Active",
                    email: "mk@gmail.com",
                    admin: "Admin",
                    password: "hashed"
                })
            })
        } as any)

        vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

        await login(req, res)
        expect(bcrypt.compare).toHaveBeenCalledWith("mk123", "hashed")
        expect(res.status).toHaveBeenCalledWith(401); expect(res.json).toHaveBeenCalledWith({ message: "Wrong Password" });
    })

    it("shall login successfully", async () => {
        req.body = {
            username: "mk",
            password: "mk123"
        }

        vi.mocked(User.findOne).mockReturnValue({
            lean: () => ({
                exec: vi.fn().mockResolvedValue({
                    username: "mk",
                    email: "mk123",
                    password: "hashed",
                    role: "Admin",
                    status: "Active"
                })
            })
        } as any)

        vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

        vi.mocked(jwt.sign).mockReturnValueOnce("accessToken" as never) .mockReturnValueOnce("refreshToken" as never);

        await login(req, res)

        expect(res.cookie).toHaveBeenCalledWith("accessToken", "accessToken", expect.objectContaining({httpOnly :true}) )
        expect(res.cookie).toHaveBeenCalledWith("refreshToken", "refreshToken", expect.objectContaining({httpOnly :true}) )

        expect(res.json).toHaveBeenCalledWith({message: "Login Successfully"})
    })
})