import EditUser from "@/components/EditUser"
import { renderWithQuery } from "@/lib/helpers/renderWithQuery"
import { updateUser } from "@/server/user"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"


const pushMock = vi.fn()
const backMock = vi.fn()

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
        back: backMock
    })
}))

vi.mock("@/server/user", () => ({
    updateUser: vi.fn()
}))

const User = {
    username: "mk",
    email: "mk@gmail.com",
    status: "Active",
    role: "Employee",
    password: "",
    _id: "123"
} as UserType

describe("Edit User", () => {

    beforeEach(()=>{
        vi.clearAllMocks()
    })

    it("should update multiple changed fields successfully", async () => {
        const mockedFn = vi.mocked(updateUser)
        mockedFn.mockResolvedValue(User)
        renderWithQuery(<EditUser id={"123"} user={User} />)

        const user = userEvent.setup()

        const username = screen.getByPlaceholderText("Enter username")
        const email =  screen.getByPlaceholderText("Enter email")
        const role = screen.getByLabelText("Role")
        const password = screen.getByPlaceholderText("Enter password")
        const status = screen.getByLabelText("Status")

        await user.clear(username)
        await user.type(username, "immk")
        await user.clear(email)
        await user.type(email, "immk@gmail.com")
        await user.clear(password)
        await user.type(password, "immk123")
        await user.selectOptions(role, "Manager")
        await user.selectOptions(status, "InActive")
        await user.click(screen.getByRole("button", {name: /Save/i}))

        await waitFor(() => {
            expect(mockedFn).toHaveBeenCalledWith({
                id:"123",
                username: "immk",
                email: "immk@gmail.com",
                password: "immk123",
                role: "Manager",
                status: "InActive",
            },
            expect.anything())
            expect(pushMock)
                .toHaveBeenCalledWith(
                    "/admin/dashboard/users"
                )
        })
    })

    it("shall update only username", async () => {
        const mockedFn = vi.mocked(updateUser)
        mockedFn.mockResolvedValue(User)
        renderWithQuery(<EditUser id={"123"} user={User} />)

        const user = userEvent.setup()

        const username = screen.getByPlaceholderText("Enter username")

        await user.clear(username)
        await user.type(username, "immk")
        await user.click(screen.getByRole("button", {name: /Save/i}))

        await waitFor(() => {
            expect(mockedFn).toHaveBeenCalledWith({
                id:"123",
                username: "immk",
            },
            expect.anything())
            expect(pushMock)
                .toHaveBeenCalledWith(
                    "/admin/dashboard/users"
                )
            })
    })
    it("shall not update user and gives error", async () => {
        const mockedFn = vi.mocked(updateUser)
        mockedFn.mockRejectedValue(new Error("something went wrong"))
        renderWithQuery(<EditUser id={"123"} user={User} />)

        const user = userEvent.setup()

        const username = screen.getByPlaceholderText("Enter username")

        await user.clear(username)
        await user.type(username, "immk")
        await user.click(screen.getByRole("button", {name: /Save/i}))

        await waitFor(() => {
            expect(screen.getByText("something went wrong")).toBeInTheDocument()
        })
    })
    it("shall show loading state will updating", async () => {
        vi.mocked(updateUser).mockImplementation(() => new Promise(() => {}))
        renderWithQuery(<EditUser id={"123"} user={User} />)
        const user = userEvent.setup()
        const username = screen.getByPlaceholderText("Enter username")

        await user.clear(username)

        await user.type(username,"immk")
        await user.click(screen.getByRole("button", {name: /Save/i}))
        
        await waitFor(() => {
            expect(screen.getByText("Saving...")).toBeInTheDocument()
        })
    })
    it("shall go back when clicked cancel", async () => {
        const user = userEvent.setup()
        renderWithQuery(<EditUser id={"123"} user={User} />)
        await user.click(screen.getByRole("button", {name: /Cancel/i}))

        await waitFor(() => {
            expect(backMock).toHaveBeenCalled()
        })
    })
})