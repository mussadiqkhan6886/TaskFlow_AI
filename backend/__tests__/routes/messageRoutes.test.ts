import request from "supertest"
import User from "../../src/models/UserModel"
import { createAccessToken } from "./noteRoutes.test"
import app from "../../src/app"

type RoleT = "Employee" | "Manager" | "Admin"

describe("message route", () => {

    beforeEach(async () => {
        await User.deleteMany({})
    })

    it.each(["Admin", "Manager"])("will successfully get staff room messages for %s", async (role) => {
        const {accessToken} = await createAccessToken(role as RoleT)

        const res = await request(app).get("/api/messages/staff-room").set("Cookie", [`accessToken=${accessToken}`])

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true);
        expect(res.body.msgs).toBeDefined();
    })
    it("will not get staff room messages for Employees", async () => {
        const {accessToken} = await createAccessToken("Employee")

        const res = await request(app).get("/api/messages/staff-room").set("Cookie", [`accessToken=${accessToken}`])

        expect(res.status).toBe(403)
        expect(res.body.success).toBe(false);
        expect(res.body.msgs).not.toBeDefined();
    })
    it("will get user room messages for Employees", async () => {
        const {accessToken} = await createAccessToken("Employee")

        const res = await request(app).get("/api/messages/user-room").set("Cookie", [`accessToken=${accessToken}`])

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true);
        expect(res.body.msgs).toBeDefined();
    })
    it.each(["Admin", "Manager"])("will get user room messages for %s", async (role) => {
        const {accessToken} = await createAccessToken(role as RoleT)

        const res = await request(app).get("/api/messages/user-room").set("Cookie", [`accessToken=${accessToken}`])

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true);
        expect(res.body.msgs).toBeDefined();
    })
})