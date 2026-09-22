import request from "supertest"
import { createAccessToken } from "./noteRoutes.test"
import app from "../../src/app"
import User from "../../src/models/UserModel"
describe("ai route", () => {

    beforeEach( async() => {
        await User.deleteMany({})
    })
    it("will post /generate successfully", async () => {
        const {accessToken} = await createAccessToken("Employee")

        const res = await request(app).post("/api/ai/generate").set("Cookie", [`accessToken=${accessToken}`]).send({
            action:"priority",
            description:"Create authentication system",
            noteId: ""
        })
        expect(res.status).toBe(200)
    })
})