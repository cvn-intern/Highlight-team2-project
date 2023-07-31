import PlayingGameScreen from "./PlayingGameScreen.component";
import WaitingRoom from "../waiting-room/Page";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useEffect } from "react";
import useToaster from "@/shared/hooks/useToaster";

export default function Page() {
  const { state } = useLocation();
  const { socket } = useSocketStore();
  const navigate = useNavigate();

  useEffect(() => {
    socket?.on('notification', (message: string) => {
      useToaster({
        type: "error",
        message,
      })
      navigate("/");
    })

    return () => {
      socket?.off("error");
      socket?.off('notification');
    };
  }, [socket]);

  // If 'wait' is undefinded, 'isRenderWaiting' is still be true
  const isRenderWaiting = state === null ? true : !!state.wait;
  if (isRenderWaiting) return <WaitingRoom />;
  return <PlayingGameScreen />;
}
