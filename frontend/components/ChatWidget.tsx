import { getMe } from "@/server/user";
import ChatWidgetClient from "./ChatWidgetClient";

const ChatWidget = async () => {
    const me = await getMe();

    const isStaff =
        me.role === "Admin" ||
        me.role === "Manager";

    return <ChatWidgetClient userId={me._id} isStaff={isStaff} />;
};

export default ChatWidget;