import { useEffect } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";

// interface Event{
//     name: string,
//     handler(...args: any[]): any;
// }

export const useSocketEvents = (eventName: string, eventHandler: any) => {
    const {socket} = useSocketStore()

    useEffect(() => {
            socket?.on(eventName, eventHandler)

        return () => {
                socket?.off(eventName)
            }
    }, [eventHandler])
}