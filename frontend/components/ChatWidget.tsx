import { getMe } from "@/server/user";
import ChatStaff from "./ChatStaff";
import ChatUser from "./ChatUser";


const ChatWidget = async () => {

    const me = await getMe();

    const isStaff =
        me.role === "Admin" ||
        me.role === "Manager";

    return (
        <section className="flex flex-row gap-10 items-end fixed bottom-0 right-10">

            <ChatUser />

            {isStaff && (
                <ChatStaff />
            )}

        </section>
    );
};


export default ChatWidget;