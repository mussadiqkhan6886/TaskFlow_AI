import User from "../../src/models/UserModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import request from "supertest"
import app from "../../src/app"

const createAccessToken = async (role: "Admin" | "Manager" | "Employee") => {
    const hashedPass = await bcrypt.hash("1234", 10)
    const createdUser = await User.create({
        username: "immk",
        email: "mk@gmail.com",
        password: hashedPass,
        role
    })

    const accessToken = jwt.sign(
        {
             UserInfo:{
                id: createdUser._id,
                username: createdUser.username,
                role: createdUser.role
            }
        },
        process.env.ACCESS_TOKEN as string,
        {expiresIn: "15m"}
    ) 

    return {accessToken, user: createdUser}
}
describe("user routes", () => {

    beforeEach(async()=>{
        await User.deleteMany({})
    })

    it("will block if no token", async () => {
        const response = await request(app).post("/api/users")
        
        expect(response.status).toBe(401)
        expect(response.body).toEqual({message: "Unauthorized"})
    })

    it("will get users successfully", async () => {
        const {accessToken} = await createAccessToken("Admin")
        const hashedPass = await bcrypt.hash("1234", 10)
        await User.create({
            username: "mussadiqkhan",
            password: hashedPass,
            role: "Employee",
            email: "mussadiqkhan@gmail.com"
        })
        const response = await request(app).get("/api/users").set("Cookie", [`accessToken=${accessToken}`])
        
        expect(response.status).toBe(200)
    })

    it("will not get users if user is employee", async () => {
        const {accessToken} = await createAccessToken("Employee")
        const response = await request(app).get("/api/users").set("Cookie", [`accessToken=${accessToken}`])
        
        expect(response.status).toBe(403)
    })

    it("will get current user successfully", async () => {
        const {accessToken} = await createAccessToken("Manager")
        const response = await request(app).get("/api/users/me").set("Cookie", [`accessToken=${accessToken}`])
        
        expect(response.status).toBe(200)
    })

    it("will get users ids successfully", async () => {
        const {accessToken} = await createAccessToken("Manager")
        const hashedPass = await bcrypt.hash("1234", 10)
        await User.create({
            username: "mussadiqmk",
            password: hashedPass,
            role: "Employee",
            email: "mkhan@gmail.com"
        })
        const response = await request(app).get("/api/users/ids").set("Cookie", [`accessToken=${accessToken}`])
        
        expect(response.status).toBe(200)
    })

    it("will not get users ids if user is Employee", async () => {
        const {accessToken} = await createAccessToken("Employee")
        const response = await request(app).get("/api/users/ids").set("Cookie", [`accessToken=${accessToken}`])
        
        expect(response.status).toBe(403)
    })

    it("will get single user successfully", async () => {
        const {accessToken, user} = await createAccessToken("Admin")
        const response = await request(app).get(`/api/users/${user._id}`).set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(200)
        
    })

    it("will not get single user if user is Employee", async () => {
        const {accessToken, user} = await createAccessToken("Employee")
        const response = await request(app).get(`/api/users/${user._id}`).set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(403)
        
    })

    it("will create new user successfully", async () => {
        const {accessToken} = await createAccessToken("Admin")
        const response = await request(app).post("/api/users").set("Cookie", [`accessToken=${accessToken}`]).send({
            username: "work",
            email: "work@gmail.com",
            password: "1234",
            role: "Employee"
        })

        expect(response.status).toBe(201)
    })

    it("will not create new user if user is Employee", async () => {
        const {accessToken} = await createAccessToken("Employee")
        const response = await request(app).post("/api/users").set("Cookie", [`accessToken=${accessToken}`]).send({
            username: "mk",
            email: "mk@gmail.com",
            password: "1234",
            role: "Employee"
        })

        expect(response.status).toBe(403)
    })

    it("will not create new user if data is not sent", async () => {
        const {accessToken} = await createAccessToken("Admin")

        const response = await request(app).post("/api/users").set("Cookie", [`accessToken=${accessToken}`]).send({})

        expect(response.status).toBe(400)
    })

    it("will update user successfully", async () => {
        const {accessToken} = await createAccessToken("Admin")
        const hashedPass = await bcrypt.hash("12345", 10)
        const createdUser = await User.create({
            username: "basit",
            email: "basit@gmail.com",
            password: hashedPass,
            role: "Employee"
        })
        const response = await request(app).patch(`/api/users/${createdUser._id}`).set("Cookie", [`accessToken=${accessToken}`]).send({
            role: "Manager"
        })

        expect(response.status).toBe(200)
    })

    it("will not update user if user is Employee", async () => {
        const {accessToken} = await createAccessToken("Employee")
        const hashedPass = await bcrypt.hash("12345", 10)
        const createdUser = await User.create({
            username: "awais",
            email: "awais@gmail.com",
            password: hashedPass,
            role: "Employee"
        })
        const response = await request(app).patch(`/api/users/${createdUser._id}`).set("Cookie", [`accessToken=${accessToken}`]).send({
            role: "Manager"
        })

        expect(response.status).toBe(403)
    })


    it("will delete user successfully", async () => {
        const {accessToken} = await createAccessToken("Admin")
        const hashedPass = await bcrypt.hash("1234", 10)
        const createdUser = await User.create({
            username: "mkkk123",
            email: "mkkk12@gmail.com",
            password: hashedPass,
            role: "Employee"
        })
        const response = await request(app).delete(`/api/users/${createdUser._id}`).set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(204)
    })

    it.each(["Employee", "Manager"])("will not delete user if user is %s", async (body) => {
        const {accessToken} = await createAccessToken(body as "Employee" | "Manager")
        const hashedPass = await bcrypt.hash("1234", 10)
        const createdUser = await User.create({
            username: `mussadiq ${body}`,
            email: `mussadiq${body}@gmail.com`,
            password: hashedPass,
            role: "Employee"
        })
        const response = await request(app).delete(`/api/users/${createdUser._id}`).set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(403)

        expect(response.body).toEqual({
            message:"Forbidden"
        })
    })
    
})