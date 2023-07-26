import { useEffect } from "react";
import PlayingGameScreen from "./PlayingGameScreen.component";
import WaitingRoom from "../waitingRoom/WaitingRoom.component";
import { useLocation } from "react-router-dom";

export default function Page() {
  // wait variable is passed from HomePage
  const { state } = useLocation();
  // Remove the state from the history, so the user can't go back to the waiting room when refeshing the page
  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);
  // If 'wait' is undefinded, 'isRenderWaiting' still be true
  const isRenderWaiting = state === null ? true : !!state.wait;
  if (isRenderWaiting) return <WaitingRoom />;
  return <PlayingGameScreen />;
}
