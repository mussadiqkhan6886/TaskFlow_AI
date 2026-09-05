import {screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithQuery } from "@/lib/helpers/renderWithQuery"
import { createUser } from "@/server/user"
import CreateUser from "@/components/CreateUser"


vi.mock("@/server/user", () => ({
    createUser: vi.fn()
}))

const backMock = vi.fn()
const pushMock = vi.fn()
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: backMock,
        push: pushMock
    })
}))

describe("create user", () => {
    beforeEach(() => {
            vi.clearAllMocks();
        });
    it("shall render create user component", () => {
        renderWithQuery(<CreateUser />)
        expect(screen.getByText("Username")).toBeInTheDocument()
    })
    it("will create a user successfully", async () => {
        
        const mockedFn = vi.mocked(createUser)
        mockedFn.mockResolvedValue({
            _id: "123",
            email: "mk@gmail.com",
            username: "mk",
            role: "Employee",
            status: "Active",
            createdAt: ""
        })
        
        renderWithQuery(<CreateUser />)
        const user = userEvent.setup()

        await user.type(screen.getByPlaceholderText("Enter username"), "mk")
        await user.type(screen.getByPlaceholderText("Enter email address"), "mk@gmail.com")
        await user.type(screen.getByPlaceholderText('Create password'), "1234")
        await user.selectOptions(screen.getByLabelText("Role"), "Employee")
        await user.selectOptions(screen.getByLabelText("Status"), "Active")
        await user.click(screen.getByRole("button", {name: /Create User/i}))

        await waitFor(() => {
            expect(mockedFn).toHaveBeenCalledWith({
                username: "mk",
                email: "mk@gmail.com",
                password: "1234",
                role: "Employee",
                status: "Active"
            })
        })

        await waitFor(() => {

            expect(mockedFn).toHaveBeenCalledTimes(1);

            expect(pushMock).toHaveBeenCalledWith("/admin/dashboard/users")
        })
    })

    it("will not create a user and give error", async () => {
        const mockedFn = vi.mocked(createUser);

        mockedFn.mockRejectedValue(
            new Error("Something went wrong")
        );


        renderWithQuery(<CreateUser />);


        const user = userEvent.setup();


        await user.type(
            screen.getByPlaceholderText("Enter username"),
            "mk"
        );

        await user.type(
            screen.getByPlaceholderText("Enter email address"),
            "mk@gmail.com"
        );

        await user.type(
            screen.getByPlaceholderText("Create password"),
            "1234"
        );


        await user.click(
            screen.getByRole("button",{
                name:/Create User/i
            })
        );


        await waitFor(()=>{
            expect(
            screen.getByText("Something went wrong")
            ).toBeInTheDocument();
        });
    })  

    it("will go back when cancel button is clicked", async () => {
        renderWithQuery(<CreateUser />)

        const user = userEvent.setup()

        await user.click(screen.getByRole("button", {name: /Cancel/i}))

        expect(backMock).toHaveBeenCalled()
    })
})