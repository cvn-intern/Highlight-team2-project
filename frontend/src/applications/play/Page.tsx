import { useEffect, useMemo } from "react";
import PlayingGameScreen from "./PlayingGameScreen.component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";

export default function Page() {
  // wait variable is passed from HomePage
  const { state } = useLocation();
  const { socket } = useSocketStore();
  const navigate = useNavigate();
  const { codeRoom } = useParams();

  useDisableBackButton();

  useEffect(() => {
    socket?.on("error", () => {
    });

    return () => {
      socket?.off("error");
    };
  }, [socket]);

  // If 'wait' is undefinded, 'isRenderWaiting' is still be true
  const isRenderWaiting = useMemo(() => state === null ? true : !!state.wait, [state])

  useEffect(() => {
    if(isRenderWaiting) navigate("../" + codeRoom + "/waiting", {replace: true})
  }, [isRenderWaiting, codeRoom])

  if(!isRenderWaiting) return <PlayingGameScreen />;
}
