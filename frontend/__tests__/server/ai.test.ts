import { fetchHelper } from "@/lib/helpers/fetchHelper"
import { generateAi } from "@/server/ai"

vi.mock("@/lib/helpers/fetchHelper", () => ({
    fetchHelper: vi.fn()
}))

describe("generate ai server", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("will successfully generate", async () => {
        vi.mocked(fetchHelper).mockResolvedValue({
            answer: "High"
        })

        const result = await generateAi({
            action: "priority", noteId: "", description: "auth for website"
        })

        expect(fetchHelper).toHaveBeenCalledWith(
            "ai/generate",
            {
                method: "POST",
                body: JSON.stringify({
                    action: "priority",
                    noteId: "",
                    description: "auth for website",
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        expect(result).toBe("High")
    })
})