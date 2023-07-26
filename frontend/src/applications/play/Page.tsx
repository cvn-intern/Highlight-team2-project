import { useEffect } from "react";
import PlayingGameScreen from "./PlayingGameScreen.component";
import WaitingRoom from "../waitingRoom/WaitingRoom.component";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";

export default function Page() {
  // wait variable is passed from HomePage
  const { state } = useLocation();
  const { socket } = useSocketStore();
  const navigate = useNavigate();
  // Remove the state from the history, so the user can't go back to the waiting room when refeshing the page
  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

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
