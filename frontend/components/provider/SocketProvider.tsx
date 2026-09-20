'use client'

import { socket } from "@/socket";
import { useEffect } from "react";

const SocketProvider = ({children}: {children: React.ReactNode}) => {
    useEffect(() => {
        socket.connect();

        const handleConnect = () => {
            console.log("Connected:", socket.id);
        };

        socket.on("connect", handleConnect);

        return () => {
            socket.off("connect", handleConnect);
            socket.disconnect();
        };
    }, []);

        return <>{children}</>
    }

export default SocketProvider
