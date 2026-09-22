import { render, screen } from "@testing-library/react";
import ChatWidget from "@/components/ChatWidget";
import { getMe } from "@/server/user";

vi.mock("@/server/user", () => ({
    getMe: vi.fn()
}));

vi.mock("@/components/ChatStaff", () => ({
    default: ({userId}: {userId:string}) => (
        <div data-testid="chat-staff">
            Staff {userId}
        </div>
    )
}));


vi.mock("@/components/ChatUser", () => ({
    default: ({userId}: {userId:string}) => (
        <div data-testid="chat-user">
            User {userId}
        </div>
    )
}));


describe("ChatWidget",()=>{

    it("renders ChatUser for normal employee", async()=>{

        vi.mocked(getMe).mockResolvedValue({
            _id:"user123",
            role:"Employee",
            username: "Mussadiq"
        });

        const Component = await ChatWidget();

        render(Component);

        expect(
            screen.getByTestId("chat-user")
        )
        .toBeInTheDocument();

        expect(
            screen.queryByTestId("chat-staff")
        )
        .not
        .toBeInTheDocument();

    });



    it.each(["Admin", "Manager"])("renders ChatStaff & chatUser for %s", async(role)=>{


        vi.mocked(getMe).mockResolvedValue({
            _id:"admin123",
            role:role,
            username: "mk"
        });

        const Component = await ChatWidget();

        render(Component);

        expect(
            screen.getByTestId("chat-user")
        )
        .toBeInTheDocument();


        expect(
            screen.getByTestId("chat-staff")
        )
        .toBeInTheDocument();


    });


});