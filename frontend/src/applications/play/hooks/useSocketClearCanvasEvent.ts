import { useContext, useEffect } from "react"
import useDrawing from "./useDrawing"
import { useSocketStore } from "@/shared/stores/socketStore";
import { CLEAR_CANVAS, DRAWER_CLEAR_CANVAS } from "@/applications/play/constants/drawEvent";
import { PaintContext } from "@/applications/play/Play";
import { useParams } from "react-router-dom";
import { UseCustomHookClearCanvasEvent } from "@/applications/play/draw";


export const useSocketClearCanvasEvent = (): UseCustomHookClearCanvasEvent => {
  let handleClickClearCanvas = () => { }
  
  const variables = useContext(PaintContext);
  if (!variables) return { handleClickClearCanvas };
  const { ctx } = variables;

  
  const { socket } = useSocketStore();
  const { codeRoom } = useParams()
  const { handleClearCanvas } = useDrawing() 

    handleClickClearCanvas = () => {
        socket?.emit(CLEAR_CANVAS, codeRoom)
        handleClearCanvas()
      }

      useEffect(() => {    
        socket?.on(DRAWER_CLEAR_CANVAS, () => {
          handleClearCanvas()
        });
    
        return () => {
          socket?.off(DRAWER_CLEAR_CANVAS);
        };
      }, [ctx]);

      return { handleClickClearCanvas }
}