import DeleteUser from "@/components/DeleteUser"
import { renderWithQuery } from "@/lib/helpers/renderWithQuery"
import { deleteUser } from "@/server/user"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"


vi.mock("@/server/user", () => ({
    deleteUser: vi.fn()
}))

const refreshMock = vi.fn()
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        refresh: refreshMock
    })
}))

describe("delete User", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    it("will delete user successfully", async () => {
        const user = userEvent.setup()
        const mockedFun = vi.mocked(deleteUser)
        mockedFun.mockResolvedValue(undefined)
        renderWithQuery(<DeleteUser id={"123"} />)

        await user.click(screen.getByRole("button", {name: /Delete/i}))

        await waitFor(() => {
            expect(mockedFun).toHaveBeenCalledWith("123")
            expect(refreshMock).toHaveBeenCalledTimes(1)
        })

    })

    it("will not delete user and gives Error", async () => {
        const user = userEvent.setup()
        const mockedFun = vi.mocked(deleteUser)
        mockedFun.mockRejectedValue(new Error("Something went wrong"))
        renderWithQuery(<DeleteUser id={"123"} />)
        const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
        await user.click(screen.getByRole("button", {name: /Delete/i}))
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("Something went wrong");
        });
        alertMock.mockRestore(); 
    })      

    it("shows loading state while deleting", async () => {
        const mockedFn = vi.mocked(deleteUser);

        mockedFn.mockImplementation(
            () => new Promise(() => {})
        );

        renderWithQuery(<DeleteUser id="123" />);

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