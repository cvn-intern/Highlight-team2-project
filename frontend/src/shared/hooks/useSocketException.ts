import { useEffect } from "react";
import { useSocketStore } from "../stores/socketStore";

export function useSocketException() {
  const { socket } = useSocketStore();
  
  useEffect(() => {
    socket?.on('message', (data: any) => {
      console.log(data);
    });
  }, []);
}