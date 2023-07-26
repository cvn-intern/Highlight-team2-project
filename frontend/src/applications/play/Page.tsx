import { useEffect, useMemo } from "react";
import PlayingGameScreen from "./PlayingGameScreen.component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";

export default function Page() {
  const { state } = useLocation();
  const { socket } = useSocketStore();
  const navigate = useNavigate();
  const { codeRoom } = useParams();

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
