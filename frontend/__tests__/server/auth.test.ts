import { login, logout } from "@/server/auth";

describe("auth server functions", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("will login successfully", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true, 
            json: () => Promise.resolve({
                message: "Login Successfully"
            })
        })

        const result = await login({
            username: "mk",
            password: "mk123"
        })

        expect(fetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
            {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({username: "mk", password: "mk123"}),
                headers: {"Content-Type": "application/json"}
            }
        )

        expect(result.message).toBe("Login Successfully")
    })

    it("will not login and gives error", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({
                message: "Wrong Password"
            })
        })

        await expect(login({
            username: "mk",
            password: "wrong"
        })).rejects.toThrow("Wrong Password")
    })

    it("will logout successfully", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({
                message: "Logged out successfully"
            })
        })

        const result = await logout()

        expect(fetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {method: "POST", credentials: "include"}
        )

        expect(result.message).toBe("Logged out successfully")

    })

})