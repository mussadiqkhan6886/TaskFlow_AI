import User from "../../src/models/UserModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import request from "supertest"
import app from "../../src/app"
import Note from "../../src/models/NoteModel"

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
describe("note routes", () => {

    beforeEach(async()=>{
        await User.deleteMany({})
        await Note.deleteMany({})
    })

    it("will block if no token", async () => {
        const response = await request(app).post("/api/notes")
        
        expect(response.status).toBe(401)
        expect(response.body).toEqual({message: "Unauthorized"})
    })

    it("will block if api limiter is hit", async () => {
        const accessToken = await createAccessToken("Admin")
        for(let i = 0; i < 200; i++){
            await request(app).post("/api/notes").set("Cookie", [`accessToken=${accessToken}`])
        }
        const response = await request(app).post("/api/notes").set("Cookie", [`accessToken=${accessToken}`])

        expect(response.body).toEqual({message: "Too many requests, please try again later."})
    })

    it("will get notes successfully", async () => {
        const {accessToken} = await createAccessToken("Admin")
        const response = await request(app).get("/api/notes").set("Cookie", [`accessToken=${accessToken}`])
        
        expect(response.status).toBe(200)
    })

    it("will get singleNote successfully", async () => {
        const {accessToken, user} = await createAccessToken("Admin")
        const createdNote = await Note.create({
            title: "testing",
            description: "testing description",
            status: "Pending",
            priority: "Low",
            noteFor: user._id
        })
        const response = await request(app).get(`/api/notes/${createdNote._id}`).set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(200)
        
    })

    it("will get not singleNote and return 400", async () => {
        const {accessToken} = await createAccessToken("Admin")
       
        const response = await request(app).get("/api/notes/undefined").set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(400)
        expect(response.body).toEqual({success:false,message:"id is required"})
        
    })

    it("will create new note successfully", async () => {
        const {accessToken, user} = await createAccessToken("Admin")

        const response = await request(app).post("/api/notes").set("Cookie", [`accessToken=${accessToken}`]).send({
            title: "testing",
            description: "testing description",
            status: "Pending",
            priority: "Low",
            noteFor: user._id
        })

        expect(response.status).toBe(201)
    })

    it("will not create new note if user is Employee", async () => {
        const {accessToken, user} = await createAccessToken("Employee")

        const response = await request(app).post("/api/notes").set("Cookie", [`accessToken=${accessToken}`]).send({
            title: "testing",
            description: "testing description",
            status: "Pending",
            priority: "Low",
            noteFor: user._id
        })

        expect(response.status).toBe(403)

        expect(response.body).toEqual({
        message:"Forbidden"
        })
    })

    it("will not create new note if data is not sent", async () => {
        const {accessToken} = await createAccessToken("Admin")

        const response = await request(app).post("/api/notes").set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(400)
    })

    it("will update current note successfully", async () => {
        const {accessToken, user} = await createAccessToken("Admin")
        const createdNote = await Note.create({
            title: "testing",
            description: "testing description",
            status: "Pending",
            priority: "Low",
            noteFor: user._id
        })
        const response = await request(app).patch(`/api/notes/${createdNote._id}`).set("Cookie", [`accessToken=${accessToken}`]).send({
            title: "testing",
            description: "testing description",
            status: "Completed",
            priority: "Low"
        })

        expect(response.status).toBe(200)
    })
    it("will not update current note if id is not given", async () => {
        const {accessToken} = await createAccessToken("Admin")
       
        const response = await request(app).patch(`/api/notes/undefined`).set("Cookie", [`accessToken=${accessToken}`]).send({
            title: "testing",
            description: "testing description",
            status: "Completed",
            priority: "Low"
        })

        expect(response.status).toBe(400)
    })

    it("will delete note successfully", async () => {
        const {accessToken, user} = await createAccessToken("Admin")
        const createdNote = await Note.create({
            title: "testing",
            description: "testing description",
            status: "Pending",
            priority: "Low",
            noteFor: user._id
        })
        const response = await request(app).delete(`/api/notes/${createdNote._id}`).set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(204)
    })

    it("will not delete note if id is not given", async () => {
        const {accessToken} = await createAccessToken("Admin")
        const response = await request(app).delete(`/api/notes/undefined`).set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(400)
    })

    it.each(["Employee", "Manager"])("will not delete note if you are %s", async (body) => {
        const {accessToken, user} = await createAccessToken(body as "Employee" | "Manager")
        const createdNote = await Note.create({
            title: "testing",
            description: "testing description",
            status: "Pending",
            priority: "Low",
            noteFor: user._id
        })
        const response = await request(app).delete(`/api/notes/${createdNote._id}`).set("Cookie", [`accessToken=${accessToken}`])

        expect(response.status).toBe(403)

        expect(response.body).toEqual({
        message:"Forbidden"
        })
    })
    
})