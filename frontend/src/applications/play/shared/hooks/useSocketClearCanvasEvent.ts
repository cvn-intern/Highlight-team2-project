import { useSocketStore } from "@/shared/stores/socketStore";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { PaintContext } from "../../PlayingGameScreen.component";
import { UseCustomHookClearCanvasEvent } from "../../draw-screen/draw";
import { CLEAR_CANVAS } from "../constants/drawEvent";
import useDrawing from "./useDrawing";


export const useSocketClearCanvasEvent = (): UseCustomHookClearCanvasEvent => {
  let handleClickClearCanvas = () => { }

  const variables = useContext(PaintContext);
  if (!variables) return { handleClickClearCanvas };


  const { socket } = useSocketStore();
  const { codeRoom } = useParams()
  const { handleClearCanvas } = useDrawing()

  handleClickClearCanvas = () => {
    socket?.emit(CLEAR_CANVAS, codeRoom)
    handleClearCanvas()
  }

  return { handleClickClearCanvas }
}