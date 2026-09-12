import app from "../../src/app";
import request from "supertest"
import User from "../../src/models/UserModel";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const user = (hashedPassword: string, status: "Active" | "InActive" = "Active") => ({
            username: "mk",
            role: "Admin" as const,
            password: hashedPassword,
            status,
            email: "mk@gmail.com"
        })

describe("auth routes", () => {
    
    beforeEach(async()=>{
        await User.deleteMany({})
    })

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
    
    it("will refresh tokens successfully", async () => {

        const hashedPassword = await bcrypt.hash("1234", 10)
        
        const createdUser = await User.create(user(hashedPassword))

        const refreshToken = jwt.sign(
            {
                id: createdUser._id,
                username: createdUser.username,
            },
            process.env.REFRESH_TOKEN as string,
            {expiresIn: "7d"}
        )

        const response = await request(app).post("/api/auth/refresh").set("Cookie", [`refreshToken=${refreshToken}`])

        expect(response.status).toBe(200)
        expect(response.body).toEqual({message: "Token refreshed"})
        expect(response.headers["set-cookie"]).toEqual(
            expect.arrayContaining([
                expect.stringContaining("accessToken")
            ])
        )
    })

    it("wont refresh tokens if no cookies", async () => {
        const response = await request(app).post("/api/auth/refresh")

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            message: "No refresh token"
        })
    })

    it("wont refresh token if token is invalid", async()=>{

        const response = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", [
                "refreshToken=wrong-token"
            ])

        expect(response.status).toBe(403)
        expect(response.body).toEqual({message: "Forbidden"})

    })

    it("wont refresh token if user is not found ", async () => {
        const fakeId = "507f1f77bcf86cd799439011"

        const refreshToken = jwt.sign(
            {
                id: fakeId,
                username: "mk"
            },
            process.env.REFRESH_TOKEN as string,
            {
                expiresIn: "7d"
            }
        )

        const response = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", [`refreshToken=${refreshToken}`])

        expect(response.status).toBe(401)

        expect(response.body).toEqual({
            message: "No User Found"
        })

    })

    it("will logout successfully", async () => {

        const hashedPass = await bcrypt.hash("1234", 10)
        const createdUser = await User.create(user(hashedPass))

        const refreshToken = jwt.sign(
            {
                username: createdUser.username,
                id: createdUser._id,
            },
            process.env.REFRESH_TOKEN as string,
            {expiresIn: "7d"}
        )


        const response = await request(app).post("/api/auth/logout").set("Cookie", [`refreshToken=${refreshToken}`])

        expect(response.status).toBe(200)
        expect(response.body).toEqual({message: "Logged out successfully"})
        expect(response.headers["set-cookie"]).toEqual(
            expect.arrayContaining([
                expect.stringContaining("refreshToken"),
                expect.stringContaining("accessToken")
            ])
        )
    })

    it("will give status of 204 if no refreshToken when logging out", async () => {
        const response = await request(app).post("/api/auth/logout")

        expect(response.status).toBe(204)
    })
})