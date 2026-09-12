import app from "../../src/app";
import request from "supertest"
import User from "../../src/models/UserModel";
import bcrypt from "bcryptjs"

const user = (hashedPassword: string, status: "Active" | "InActive" = "Active") => ({
            username: "mk",
            role: "Admin" as const,
            password: hashedPassword,
            status,
            email: "mk@gmail.com"
        })

describe("auth routes", () => {

    it("will login user successfully", async () => {

        const hashedPassword = await bcrypt.hash("1234", 10)

        await User.create(user(hashedPassword))

        const response = await request(app)
                            .post("/api/auth/login")
                            .send({
                                username: "mk",
                                password: "1234"
                     })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({message: "Login Successfully"})
        expect(response.headers["set-cookie"]).toBeDefined()
    })
    it.each([
        {},
        { username:"mk" },
        { password:"1234" }
    ])(
        "will not login with invalid credentials %o",
        async(body) => {

            const response = await request(app)
                .post("/api/auth/login")
                .send(body)


            expect(response.status).toBe(400)

            expect(response.body).toEqual({
                message:"Please Enter both username and password"
            })

        }
    )

    it("will not login when user does not exist", async () => {

        const response = await request(app)
                            .post("/api/auth/login")
                            .send({
                                username: "mussadiq",
                                password: "1234"
             })

        expect(response.status).toBe(404)
        expect(response.body).toEqual({message: "No username found with this username or he is inactive"})
    })

    it("will not login when user is inactive", async()=>{

        const hashedPassword =
            await bcrypt.hash("1234",10)


        await User.create(user(hashedPassword, "InActive") )


        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username:"mk",
                password:"1234"
            })


        expect(response.status).toBe(404)

        expect(response.body).toEqual({
            message:"No username found with this username or he is inactive"
        })

    })

    it("will not login when password is wrong", async()=>{

        const hashedPassword =
            await bcrypt.hash("1234",10)


        await User.create(
            user(hashedPassword),
        )


        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username:"mk",
                password:"123"
            })


        expect(response.status).toBe(401)

        expect(response.body).toEqual({
            message:"Wrong Password"
        })

    })

    it("will block too many login attempts", async()=>{

        for(let i=0;i<5;i++){
            await request(app)
            .post("/api/auth/login")
            .send({
                username:"wrong",
                password:"wrong"
            })
        }


        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username:"wrong",
                password:"wrong"
            })


        expect(response.status)
            .toBe(429)

    })
    
})