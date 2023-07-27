import PlayingGameScreen from "./PlayingGameScreen.component";
import WaitingRoom from "../waiting-room/Page";
import { useLocation } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useEffect } from "react";

export default function Page() {
  const { state } = useLocation();
  const { socket } = useSocketStore();

  useEffect(() => {
    return () => {
      socket?.off("error");
    };
  }, [socket]);

  // If 'wait' is undefinded, 'isRenderWaiting' is still be true
  const isRenderWaiting = state === null ? true : !!state.wait;
  if (isRenderWaiting) return <WaitingRoom />;
  return <PlayingGameScreen />;
}
