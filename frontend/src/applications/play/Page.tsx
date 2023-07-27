import PlayingGameScreen from "./PlayingGameScreen.component";
import WaitingRoom from "../waiting-room/Page";
import { useLocation } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";
import useToaster from "@/shared/hooks/useToaster";
import { useEffect } from "react";

export default function Page() {
  const { state } = useLocation();
  const { socket } = useSocketStore();

  useEffect(() => {
    socket?.on('qualify-to-start', (data: boolean) => {
      useToaster({
        type: data ? "success" : "error",
        message: data ? "You can start the game now!" : "You can't start the game now!",
      })
    })

    return () => {
      socket?.off("error");
      socket?.off("qualify-to-start");
    };
  }, [socket]);

  // If 'wait' is undefinded, 'isRenderWaiting' is still be true
  const isRenderWaiting = state === null ? true : !!state.wait;
  if (isRenderWaiting) return <WaitingRoom />;
  return <PlayingGameScreen />;
}
