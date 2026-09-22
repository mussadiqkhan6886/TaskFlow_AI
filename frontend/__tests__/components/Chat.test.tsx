import { screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "@/components/Chat";
import { getAllMessages } from "@/server/message";
import { socket } from "@/socket";
import { renderWithQuery } from "@/lib/helpers/renderWithQuery";


vi.mock("@/server/message", () => ({
    getAllMessages: vi.fn(),
}));


vi.mock("@/socket", () => ({
    socket: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
    }
}));


vi.mock("@/lib/helpers/formatDate", () => ({
    formatDate: vi.fn(() => "22 Sep 2026"),
}));


vi.mock("react-icons/fi", () => ({
    FiChevronUp: (props:any)=><span {...props}>open</span>,
    FiX: (props:any)=><span {...props}>close</span>,
    FiInfo: ()=><span>info</span>,
    FiSend: ()=> <span>send</span>,
}));


vi.mock("@/components/MessageTyping",()=>({
    default: ()=> <div data-testid="typing"/>
}));


vi.mock("@/components/ChatLoader",()=>({
    default: ()=> <div data-testid="loader"/>
}));



const mockMessages = [
    {
        _id:"1",
        message:"Hello team",
        room:"staff-room",
        senderId:{
            _id:"user1",
            username:"admin",
            role:"Admin"
        },
        readBy:[],
        createdAt:"2026-09-22"
    }
];



const renderComponent = () => {

    return renderWithQuery(
            <Chat
                name="S"
                room="staff-room"
                userId="user1"
            />
    )
}



describe("Chat component",()=>{

    beforeEach(()=>{

        vi.clearAllMocks();

        vi.mocked(getAllMessages).mockResolvedValue(mockMessages as Message[]);

    });


    it("renders chat header",async()=>{

        renderComponent();

        expect(
            screen.getByText("S")
        ).toBeInTheDocument();


        expect(
            screen.getByText(/staff room/i)
        ).toBeInTheDocument();

    });



    it("fetches and displays messages",async()=>{

        renderComponent();

        expect(
            await screen.findByText("Hello team")
        )
        .toBeInTheDocument();

        expect(getAllMessages)
        .toHaveBeenCalledWith(
            "staff-room"
        );

    });


    it("opens chat when collapse button clicked",async()=>{

        renderComponent();

        const open = screen.getByText("open");

        fireEvent.click(open);

        await waitFor(()=>{
            expect(
                screen.getByText("Hello team")
            )
            .toBeInTheDocument();
        });

    });



    it("sends message using socket",async()=>{

        renderComponent();
        const input =
            screen.getByPlaceholderText(
                "Enter your message..."
            );

        fireEvent.change(input,{
            target:{
                value:"Hello"
            }
        });


        fireEvent.submit(
            input.closest("form")!
        );

        expect(socket.emit)
        .toHaveBeenCalledWith(
            "typing",
            {
                room:"staff-room"
            }
        );

        expect(socket.emit)
        .toHaveBeenCalledWith(
            "send-message",
            {
                message:"Hello",
                room:"staff-room"
            }
        );


    });


    it("registers socket listeners",()=>{

        renderComponent();

        expect(socket.on)
        .toHaveBeenCalledWith(
            "new-message",
            expect.any(Function)
        );

        expect(socket.on)
        .toHaveBeenCalledWith(
            "online-users",
            expect.any(Function)
        );

        expect(socket.on)
        .toHaveBeenCalledWith(
            "messages-read",
            expect.any(Function)
        );


        expect(socket.on)
        .toHaveBeenCalledWith(
            "user-typing",
            expect.any(Function)
        );

    });



    it("cleans socket listeners on unmount",()=>{

        const {unmount}=renderComponent();

        unmount();


        expect(socket.off)
        .toHaveBeenCalledWith(
            "new-message",
            expect.any(Function)
        );


        expect(socket.off)
        .toHaveBeenCalledWith(
            "online-users",
            expect.any(Function)
        );


    });



    it("emits typing when user enters text",()=>{


        renderComponent();


        const input =
            screen.getByPlaceholderText(
                "Enter your message..."
            );


        fireEvent.change(input,{
            target:{
                value:"typing..."
            }
        });


        expect(socket.emit)
        .toHaveBeenCalledWith(
            "typing",
            {
                room:"staff-room"
            }
        );

    });


});