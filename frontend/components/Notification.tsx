'use client';

import { socket } from '@/socket';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const Notification = () => {
    useEffect(() => {
    const handleNotification = (data: {message: string}) => {
      toast.success(data.message, {id: "CreatedNote"})
    }

    socket.on("notification-note", handleNotification)

    return () => {
      socket.off("notification-note", handleNotification)
    }
  }, [])

useEffect(() => {
    const handleNotification = (data:{
        username:string,
        title:string
    }) => {

        toast.success(
            `${data.username} Completed ${data.title} Task`,
            {
                id:"update"
            }
        );

    };

    socket.on("notification", handleNotification);
    return () => {
        socket.off("notification", handleNotification);
    };

}, []);
  return null
}

export default Notification
