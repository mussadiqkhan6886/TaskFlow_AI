import { fetchHelper } from "@/lib/helpers/fetchHelper"
import { cookies } from "next/headers"


vi.mock("next/headers",()=>({
    cookies: vi.fn()
}))


describe("fetchHelper",()=>{

    beforeEach(()=>{
        vi.clearAllMocks()

        process.env.NEXT_PUBLIC_BASE_URL =
        "http://localhost:3000"
    })


    it("should fetch data successfully", async()=>{

        vi.mocked(cookies).mockResolvedValue({
            toString:()=> "accessToken=123"
        } as any)


        global.fetch = vi.fn()
            .mockResolvedValue({
                ok:true,
                json:()=>Promise.resolve({
                    username:"mk"
                })
            })


        const result = await fetchHelper("users")


        expect(result)
        .toEqual({
            username:"mk"
        })


    })



    it("should send cookies in request", async()=>{

        vi.mocked(cookies).mockResolvedValue({
            toString:()=> "accessToken=123"
        } as any)


        global.fetch = vi.fn()
        .mockResolvedValue({
            ok:true,
            json:()=>Promise.resolve({})
        })


        await fetchHelper("users")


        expect(fetch)
        .toHaveBeenCalledWith(
            "http://localhost:3000/api/users",
            expect.objectContaining({
                headers:{
                    Cookie:"accessToken=123"
                }
            })
        )

    })



    it("should throw error when API fails", async()=>{

        vi.mocked(cookies).mockResolvedValue({
            toString:()=> "accessToken=123"
        } as any)


        global.fetch = vi.fn()
        .mockResolvedValue({

            ok:false,

            json:()=>Promise.resolve({
                message:"Unauthorized"
            })

        })


        await expect(
            fetchHelper("users")
        )
        .rejects
        .toThrow("Unauthorized")


    })



    it("should return undefined for 204 response", async()=>{

        vi.mocked(cookies).mockResolvedValue({
            toString:()=> "accessToken=123"
        } as any)


        global.fetch = vi.fn()
        .mockResolvedValue({

            status:204

        })


        const result = await fetchHelper("users")


        expect(result)
        .toBeUndefined()

    })


})