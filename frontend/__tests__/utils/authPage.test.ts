import { requiredRole } from "@/lib/helpers/authPage"
import { getMe } from "@/server/user"
import { redirect } from "next/navigation"


vi.mock("@/server/user",()=>({
    getMe: vi.fn()
}))


vi.mock("next/navigation",()=>({
    redirect: vi.fn()
}))


describe("required role",()=>{

    beforeEach(()=>{
        vi.clearAllMocks()
    })

    it("shall return user when role is allowed", async()=>{

        vi.mocked(getMe).mockResolvedValue({
            _id:"123",
            username:"mk",
            role:"Employee"
        })


        const result = await requiredRole([
            "Employee"
        ])


        expect(result).toEqual({
            _id:"123",
            username:"mk",
            role:"Employee"
        })


    })


    it("shall redirect when role is not allowed", async()=>{

        vi.mocked(getMe).mockResolvedValue({
            _id:"123",
            username:"mk",
            role:"Employee"
        })


        await requiredRole([
            "Admin"
        ])


        expect(redirect)
        .toHaveBeenCalledWith(
            "/admin/dashboard"
        )

    })

})