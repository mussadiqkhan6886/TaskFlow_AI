import {screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import CreateNote from "@/components/CreateNote"
import { renderWithQuery } from "@/lib/helpers/renderWithQuery";
import { createNote } from "@/server/note";
import { getUsersId } from "@/server/user";


vi.mock("@/server/note", () => ({
    createNote: vi.fn()
}))

vi.mock("@/server/user", () => ({
    getUsersId: vi.fn()
}))

const pushMock = vi.fn();
const backMock = vi.fn()
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
        back: backMock
    })
}))

describe("create a note", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shall render create note component", () => {
        renderWithQuery(<CreateNote />)

        expect(screen.getByText("Note For")).toBeInTheDocument()
    })

    it("shall create a new note", async () => {

        const mockedFunction = vi.mocked(createNote)

        vi.mocked(getUsersId).mockResolvedValue([{_id: "123", username: "john"}])
        
        mockedFunction.mockResolvedValue({
            _id: "1",
            noteFor: "123",
            title: "Hello World",
            description: "description of note",
            priority: "Low",
            status: "Pending",
            createdAt: ""
        })

        renderWithQuery(<CreateNote />)
         await waitFor(() => {
        expect(
            screen.getByRole("option", {
                name:"john"
            })
        ).toBeInTheDocument()
    })


        const user = userEvent.setup()

        await user.selectOptions(screen.getByLabelText("Note For"), "123")

        await user.type(screen.getByPlaceholderText("Enter note title"), "Hello World")

        await user.type(screen.getByPlaceholderText("Write your note details..."), "this is description of testing")

        await user.selectOptions(screen.getByLabelText("Priority"), "Low")

        await user.click(screen.getByRole("button", {name: /Create Note/i}))

        await waitFor(() => {
            expect(mockedFunction).toHaveBeenCalledWith({
                noteFor: "123",
                title: "Hello World",
                description: "this is description of testing",
                priority: "Low"
            },
            expect.anything())
            
        })

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith(
                "/admin/dashboard/notes"
            );
        })
    })

    it("shall not create a new note and give error", async () => {
        const mockedFunction = vi.mocked(createNote)
        mockedFunction.mockRejectedValue(
            new Error("Something went wrong")
        );
        vi.mocked(getUsersId).mockResolvedValue([
            {
                _id:"123",
                username:"john"
            }
        ]);

        renderWithQuery(<CreateNote />)
         await waitFor(() => {
        expect(
            screen.getByRole("option", {
                name:"john"
            })
        ).toBeInTheDocument()
    })

        const user = userEvent.setup()
        await user.selectOptions( screen.getByLabelText("Note For"), "123" );
        
        await user.type( screen.getByPlaceholderText("Enter note title"), "Hello");
        await user.type( screen.getByPlaceholderText("Write your note details..."),"Some description" );
        await user.click(screen.getByRole("button", {name: /Create Note/i}))

        await waitFor(() => {
            expect(screen.getByText("Something went wrong")).toBeInTheDocument()
        })
    })

    it("goes back when cancel is clicked", async () => {
        renderWithQuery(<CreateNote />)

        const user = userEvent.setup()

        await user.click(
            screen.getByRole("button", {
                name:/Cancel/i
            })
        )

        expect(backMock).toHaveBeenCalled()
    })
})