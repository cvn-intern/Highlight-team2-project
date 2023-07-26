import { useEffect } from "react";
import PlayingGameScreen from "./PlayingGameScreen";
import WaitingRoom from "../waitingRoom/WaitingRoom";
import { useLocation } from "react-router-dom";
// import { useSocketStore } from "@/shared/stores/socketStore";

export default function Page() {
  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);
  // wait variable is passed from HomePage
  const { state } = useLocation();
  // If 'wait' is undefinded, 'isRenderWaiting' still be true
  const isRenderWaiting = state === null ? true : !!state.wait;
  if (isRenderWaiting) return <WaitingRoom />;
  if (!isRenderWaiting) return <PlayingGameScreen />;
}
