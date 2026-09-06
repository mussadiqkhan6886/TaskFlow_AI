import Search from "@/components/Search";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";


const pushMock = vi.fn();

const searchParams = new URLSearchParams();


vi.mock("@/hooks/useDebounce", () => ({
    default: (value: string) => value
}));


vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock
    }),

    useSearchParams: () => searchParams
}));



describe("User Search Component", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        searchParams.delete("search");
        searchParams.delete("status");
    });



    it("should render search input and status select", () => {

        render(<Search />);

        expect(
            screen.getByPlaceholderText("Search users...")
        ).toBeInTheDocument();


        expect(
            screen.getByRole("combobox")
        ).toBeInTheDocument();

    });



    it("should update search query when typing", async () => {

        render(<Search />);

        const user = userEvent.setup();


        const input = screen.getByPlaceholderText(
            "Search users..."
        );


        await user.type(input, "john");


        await waitFor(() => {

            expect(pushMock).toHaveBeenCalledWith(
                "/admin/dashboard/users?search=john"
            );

        });

    });



    it("should remove search query when input is cleared", async () => {


        searchParams.set(
            "search",
            "john"
        );


        render(<Search />);


        const user = userEvent.setup();


        const input = screen.getByDisplayValue(
            "john"
        );


        await user.clear(input);



        await waitFor(() => {

            expect(pushMock).toHaveBeenCalledWith(
                "/admin/dashboard/users?"
            );

        });


    });



    it("should update status query", async () => {


        render(<Search />);


        const user = userEvent.setup();


        await user.selectOptions(
            screen.getByRole("combobox"),
            "Active"
        );


        expect(pushMock).toHaveBeenCalledWith(
            "/admin/dashboard/users?status=Active"
        );


    });



    it("should remove status query when selecting All Status", async () => {


        searchParams.set(
            "status",
            "Active"
        );


        render(<Search />);


        const user = userEvent.setup();


        await user.selectOptions(
            screen.getByRole("combobox"),
            ""
        );


        expect(pushMock).toHaveBeenCalledWith(
            "/admin/dashboard/users?"
        );


    });



    it("should show existing search value from URL", () => {


        searchParams.set(
            "search",
            "mussadiq"
        );


        render(<Search />);



        expect(
            screen.getByDisplayValue("mussadiq")
        ).toBeInTheDocument();


    });


});