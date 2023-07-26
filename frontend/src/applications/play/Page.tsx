import { useEffect } from "react";
import PlayingGameScreen from "./PlayingGameScreen.component";
import WaitingRoom from "../waiting-room/Page";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";

export default function Page() {
  // wait variable is passed from HomePage
  const { state } = useLocation();
  const { socket } = useSocketStore();
  const navigate = useNavigate();

  useDisableBackButton();

  useEffect(() => {
    socket?.on("error", () => {
      navigate("/user/existing");
    });

    return () => {
      socket?.off("error");
    };
  }, [socket]);

  // If 'wait' is undefinded, 'isRenderWaiting' is still be true
  const isRenderWaiting = state === null ? true : !!state.wait;
  if (isRenderWaiting) return <WaitingRoom />;
  return <PlayingGameScreen />;
}
