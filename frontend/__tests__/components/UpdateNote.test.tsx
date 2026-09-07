import UpdateNote from "@/components/UpdateNote"
import { renderWithQuery } from "@/lib/helpers/renderWithQuery"
import { updateNote } from "@/server/note"
import { getUsersId } from "@/server/user"
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
    getUsersId: vi.fn()
}))

vi.mock("@/server/note", () => ({
    updateNote: vi.fn()
}))

const Note = {
    _id: "456",
    title: "crud operation",
    description: "this is description",
    noteFor: "123",
    priority: "Low",
    createdAt: "",
    status: "Pending"
} as NoteType

describe("Edit Note", () => {

    beforeEach(()=>{
        vi.clearAllMocks()
    })

    it("should update multiple changed fields successfully", async () => {
        vi.mocked(getUsersId).mockResolvedValue([
            {
                _id: "123",
                username: "john"
            }
            ])
        const mockedFn = vi.mocked(updateNote)
        mockedFn.mockResolvedValue(Note)
        
        renderWithQuery(<UpdateNote note={Note} />)

        const user = userEvent.setup()
        await waitFor(() => {
            expect(screen.getByRole("option", {name:"john"})).toBeInTheDocument()
        })
        const noteFor = screen.getByLabelText("Note For")
        const title =  screen.getByPlaceholderText("Enter note title")
        const description = screen.getByPlaceholderText("Write note details...")
        const priority = screen.getByLabelText("Priority")
        const status = screen.getByLabelText("Status")

        await user.selectOptions(noteFor, "123")
        await user.clear(title)
        await user.type(title, "testing")
        await user.clear(description)
        await user.type(description, "new description of note")
        await user.selectOptions(priority, "Medium")
        await user.selectOptions(status, "Completed")
        await user.click(screen.getByRole("button", {name: /Save Note/i}))

        await waitFor(() => {
            expect(mockedFn).toHaveBeenCalledWith({
                id:"456",
                noteFor: "123",
                title: "testing",
                description: "new description of note",
                priority: "Medium",
                status: "Completed",
            },expect.anything())
            expect(pushMock)
                .toHaveBeenCalledWith(
                    "/admin/dashboard/notes"
                )
        })
    })

    it("shall update only title", async () => {
        const mockedFn = vi.mocked(updateNote)
        mockedFn.mockResolvedValue(Note)
        vi.mocked(getUsersId).mockResolvedValue([
            {
            _id:"123",
            username:"john"
            }
            ])
        renderWithQuery(<UpdateNote  note={Note} />)

        const user = userEvent.setup()

        const title = screen.getByPlaceholderText("Enter note title")

        await user.clear(title)
        await user.type(title, "new title testing")
        await user.click(screen.getByRole("button", {name: /Save Note/i}))

        await waitFor(() => {
            expect(mockedFn).toHaveBeenCalledWith({
                id:"456",
    noteFor:"123",
    title:"new title testing",
    description:"this is description",
    priority:"Low",
    status:"Pending",
            }, expect.anything())
            expect(pushMock)
                .toHaveBeenCalledWith(
                    "/admin/dashboard/notes"
                )
            })
    })
    it("shall not update note and gives error", async () => {
        const mockedFn = vi.mocked(updateNote)
        mockedFn.mockRejectedValue(new Error("something went wrong"))
        renderWithQuery(<UpdateNote  note={Note} />)

        const user = userEvent.setup()

        const title = screen.getByPlaceholderText("Enter note title")

        await user.clear(title)
        await user.type(title, "testing")
        await user.click(screen.getByRole("button", {name: /Save Note/i}))

        await waitFor(() => {
            expect(screen.getByText("something went wrong")).toBeInTheDocument()
        })
    })

    it("shall show loading state will updating", async () => {
        vi.mocked(updateNote).mockImplementation(() => new Promise(() => {}))
        renderWithQuery(<UpdateNote note={Note} />)
        const user = userEvent.setup()
        const title = screen.getByPlaceholderText("Enter note title")

        await user.clear(title)

        await user.type(title,"testing")
        await user.click(screen.getByRole("button", {name: /Save Note/i}))
        
        await waitFor(() => {
            expect(screen.getByText("Saving...")).toBeInTheDocument()
        })
    })
    it("shall go back when clicked cancel", async () => {
        const user = userEvent.setup()
        renderWithQuery(<UpdateNote note={Note} />)
        await user.click(screen.getByRole("button", {name: /Cancel/i}))

        await waitFor(() => {
            expect(backMock).toHaveBeenCalled()
        })
    })
})