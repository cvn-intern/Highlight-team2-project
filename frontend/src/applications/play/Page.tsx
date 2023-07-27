import { useEffect } from "react";
import PlayingGameScreen from "./PlayingGameScreen.component";
import WaitingRoom from "../waiting-room/Page";
import { useLocation } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";

export default function Page() {
  const { state } = useLocation();
  const { socket } = useSocketStore();

  useEffect(() => {
    socket?.on('qualify-to-start', (data: any) => {
      alert(data);
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
