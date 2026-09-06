import NoteQuery from "@/components/NoteQuery";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();

const searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
    useSearchParams: () => searchParams,
}));

describe("note page query filtration", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        searchParams.delete("priority");
        searchParams.delete("status");
    });

    it("renders both filters", () => {
        render(<NoteQuery />);

        expect(
            screen.getByDisplayValue("All Priority")
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue("All Status")
        ).toBeInTheDocument();
    });

    it("updates priority query", async () => {

        render(<NoteQuery />);

        const user = userEvent.setup();

        const selects = screen.getAllByRole("combobox");

        await user.selectOptions(selects[0], "High");

        expect(pushMock).toHaveBeenCalledWith(
            "/admin/dashboard/notes?priority=High"
        );
    });

    it("updates status query", async () => {

        render(<NoteQuery />);

        const user = userEvent.setup();

        const selects = screen.getAllByRole("combobox");

        await user.selectOptions(selects[1], "Completed");

        expect(pushMock).toHaveBeenCalledWith(
            "/admin/dashboard/notes?status=Completed"
        );
    });

    it("removes priority query when selecting All Priority", async () => {

        searchParams.set("priority", "High");

        render(<NoteQuery />);

        const user = userEvent.setup();

        const selects = screen.getAllByRole("combobox");

        await user.selectOptions(selects[0], "");

        expect(pushMock).toHaveBeenCalledWith(
            "/admin/dashboard/notes?"
        );
    });

    it("removes status query when selecting All Status", async () => {

        searchParams.set("status", "Completed");

        render(<NoteQuery />);

        const user = userEvent.setup();

        const selects = screen.getAllByRole("combobox");

        await user.selectOptions(selects[1], "");

        expect(pushMock).toHaveBeenCalledWith(
            "/admin/dashboard/notes?"
        );
    });

});