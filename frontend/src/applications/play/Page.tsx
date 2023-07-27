import PlayingGameScreen from "./PlayingGameScreen.component";
import WaitingRoom from "../waiting-room/Page";
import { useLocation } from "react-router-dom";

export default function Page() {
  const { state } = useLocation();

  // If 'wait' is undefinded, 'isRenderWaiting' is still be true
  const isRenderWaiting = state === null ? true : !!state.wait;
  if (isRenderWaiting) return <WaitingRoom />;
  return <PlayingGameScreen />;
}
