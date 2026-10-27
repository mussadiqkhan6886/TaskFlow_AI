import { screen, fireEvent, act } from "@testing-library/react";
import Chat from "@/components/Chat";
import { getAllMessages } from "@/server/message";
import { socket } from "@/socket";
import { renderWithQuery } from "@/lib/helpers/renderWithQuery";
import { Message } from "@/type";


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
    FiMessageSquare: (props:any)=><span {...props}>open</span>,
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



const renderComponent = (isOpen = true, onToggle = vi.fn()) => {

    return renderWithQuery(
            <Chat
                name="S"
                room="staff-room"
                userId="user1"
                isOpen={isOpen}
                onToggle={onToggle}
            />
    )
}



describe("Chat component",()=>{

    beforeEach(()=>{

        vi.clearAllMocks();

        vi.mocked(getAllMessages).mockResolvedValue({
            msgs: mockMessages as Message[],
            hasMore: false,
            nextCursor: null
        });

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
            "staff-room",
            { limit: 10 }
        );

    });


    it("opens chat when collapse button clicked",async()=>{

        const onToggle = vi.fn();
        renderComponent(false, onToggle);

        const open = screen.getByRole("button", {
            name: /Open S chat/i
        });

        fireEvent.click(open);

        expect(onToggle).toHaveBeenCalled();

    });



    it("sends message using socket",async()=>{

        renderComponent();
        const input =
            screen.getByPlaceholderText(
                "Type a message..."
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
                "Type a message..."
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

    it("appends new incoming message at bottom of list", async () => {
        let newMessageHandler: ((data: Message) => void) | undefined;
        vi.mocked(socket.on).mockImplementation((event: string, handler: any) => {
            if (event === "new-message") {
                newMessageHandler = handler;
            }
            return socket as any;
        });

        renderComponent();

        expect(await screen.findByText("Hello team")).toBeInTheDocument();

        // Simulate incoming message via socket
        act(() => {
            if (newMessageHandler) {
                newMessageHandler({
                    _id: "2",
                    message: "A newly arrived message",
                    room: "staff-room",
                    senderId: {
                        _id: "user2",
                        username: "employee1",
                        role: "Employee"
                    },
                    readBy: [],
                    createdAt: "2026-09-22T12:00:00Z"
                });
            }
        });

        expect(await screen.findByText("A newly arrived message")).toBeInTheDocument();

        // Both messages must be present, with older first and newest last
        const allMsgElements = screen.getAllByText(/Hello team|A newly arrived message/);
        expect(allMsgElements[0]).toHaveTextContent("Hello team");
        expect(allMsgElements[1]).toHaveTextContent("A newly arrived message");
    });

    it("loads older messages when scrolling to top", async () => {
        vi.mocked(getAllMessages)
            .mockResolvedValueOnce({
                msgs: [
                    {
                        _id: "10",
                        message: "Initial page message",
                        room: "staff-room",
                        senderId: { _id: "user1", username: "admin", role: "Admin" },
                        readBy: [],
                        createdAt: "2026-09-22T10:00:00Z"
                    }
                ],
                hasMore: true,
                nextCursor: "10"
            })
            .mockResolvedValueOnce({
                msgs: [
                    {
                        _id: "5",
                        message: "Older loaded message",
                        room: "staff-room",
                        senderId: { _id: "user1", username: "admin", role: "Admin" },
                        readBy: [],
                        createdAt: "2026-09-22T08:00:00Z"
                    }
                ],
                hasMore: false,
                nextCursor: null
            });

        renderComponent();

        expect(await screen.findByText("Initial page message")).toBeInTheDocument();

        // Find scrollable container and fire scroll event near top (scrollTop: 20)
        const scrollableContainer = screen.getByText("Initial page message").closest(".overflow-y-auto");
        expect(scrollableContainer).not.toBeNull();

        if (scrollableContainer) {
            Object.defineProperty(scrollableContainer, "scrollTop", { value: 20, writable: true });
            Object.defineProperty(scrollableContainer, "scrollHeight", { value: 500, writable: true });

            await act(async () => {
                fireEvent.scroll(scrollableContainer);
            });
        }

        expect(getAllMessages).toHaveBeenCalledWith("staff-room", {
            limit: 10,
            before: "10"
        });

        expect(await screen.findByText("Older loaded message")).toBeInTheDocument();

        // Verify older message is prepended above initial message
        const messages = screen.getAllByText(/Older loaded message|Initial page message/);
        expect(messages[0]).toHaveTextContent("Older loaded message");
        expect(messages[1]).toHaveTextContent("Initial page message");
    });

});
