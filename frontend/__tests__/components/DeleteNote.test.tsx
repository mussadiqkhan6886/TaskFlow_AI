import DeleteNote from "@/components/DeleteNote"
import { renderWithQuery } from "@/lib/helpers/renderWithQuery"
import { deleteNote } from "@/server/note"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"


vi.mock("@/server/note", () => ({
    deleteNote: vi.fn()
}))

const refreshMock = vi.fn()
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        refresh: refreshMock
    })
}))

describe("delete note", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    it("will delete note successfully", async () => {
        const user = userEvent.setup()
        const mockedFun = vi.mocked(deleteNote)
        mockedFun.mockResolvedValue(undefined)
        renderWithQuery(<DeleteNote id={"123"} />)

        await user.click(screen.getByRole("button", {name: /Delete/i}))

        await waitFor(() => {
            expect(mockedFun).toHaveBeenCalledWith("123",
 expect.anything())
            expect(refreshMock).toHaveBeenCalledTimes(1)
        })

    })

    it("will not delete note and gives Error", async () => {
        const user = userEvent.setup()
        const mockedFun = vi.mocked(deleteNote)
        mockedFun.mockRejectedValue(new Error("Something went wrong"))
        renderWithQuery(<DeleteNote id={"123"} />)
        const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
        await user.click(screen.getByRole("button", {name: /Delete/i}))
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("Something went wrong");
        });
        alertMock.mockRestore(); 
    })     
    
    it("shows loading state while deleting", async () => {
        const mockedFn = vi.mocked(deleteNote);

        mockedFn.mockImplementation(
            () => new Promise(() => {})
        );

        renderWithQuery(<DeleteNote id="123" />);

        const user = userEvent.setup();

        await user.click(
            screen.getByRole("button", {
                name: /Delete/i
            })
        );

        expect(
            screen.getByText("Deleting...")
        ).toBeInTheDocument();
    });
})