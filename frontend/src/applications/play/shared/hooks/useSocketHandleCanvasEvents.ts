import { useContext, useEffect, useState } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { Drawing, Point, SocketDrawing, SocketGetCanvasState, SocketStartDraw, StartDraw, UseCustomHookHandleCanvasEvents } from "../../draw-screen/draw";
import useDrawing from "./useDrawing";
import { CANVAS_STATE, CANVAS_STATE_FROM_SERVER, DRAWER_DRAWING, DRAWER_FINISH_DRAWING, DRAWER_START_DRAWING, DRAWING, FINISH_DRAW, GET_CANVAS_STATE, NEW_PLAYER, START_DRAW } from "../constants/drawEvent";
import { useParams } from "react-router";
import { PaintContext } from "../../PlayingGameScreen.component";


export function useSocketHandleCanvasEvent(): UseCustomHookHandleCanvasEvents {
  let handleMouseDown = (_: Point) => { }
  let handleMouseMove = (_: Point) => { }
  let handleMouseUpOrLeave = () => { }

  const variables = useContext(PaintContext);
  if (!variables) return { handleMouseDown, handleMouseMove, handleMouseUpOrLeave };
  const {
    ctx,
    canvasRef,
    snapshot,
    isDrawing,
    color,
    penStyle,
    isFill,
    brushSize,
  } = variables;

  const { socket } = useSocketStore();
  const { codeRoom } = useParams()
  const [isNewPlayer, setIsNewPlayer] = useState<boolean>(true)

  const { handleStartDraw, handleDrawing, handleFinishDraw } = useDrawing()

  handleMouseDown = (point: Point) => {
    socket?.emit(START_DRAW, { codeRoom, point, color, penStyle, brushSize } as SocketStartDraw);
    handleStartDraw({ point, color, penStyle, brushSize, ctx } as StartDraw);
  };

  handleMouseMove = (currentPoint: Point) => {
    if (!isDrawing) return
      socket?.emit(DRAWING, { codeRoom, currentPoint, penStyle, color, isFill } as SocketDrawing);
      snapshot && handleDrawing({ currentPoint, color, penStyle, snapshot, isFill, ctx } as Drawing);
  };

  handleMouseUpOrLeave = () => {
    if (!isDrawing) return
    socket?.emit(FINISH_DRAW, codeRoom);
    handleFinishDraw();
  };


  useEffect(() => {
    socket?.on(DRAWER_START_DRAWING, ({ point, color, penStyle, brushSize }: StartDraw) => {
      ctx && handleStartDraw({ point, color, penStyle, brushSize, ctx });
    });

    socket?.on(DRAWER_DRAWING, ({ currentPoint, color, penStyle, isFill }: Drawing) => {
      snapshot && ctx && handleDrawing({ currentPoint, color, penStyle, snapshot, isFill, ctx });
    });

    socket?.on(DRAWER_FINISH_DRAWING, () => {
      handleFinishDraw()
    });

    return () => {
      socket?.off(DRAWER_START_DRAWING);
      socket?.off(DRAWER_DRAWING);
      socket?.off(DRAWER_FINISH_DRAWING);
    };
  }, [canvasRef, snapshot, ctx]);

  useEffect(() => {
    if (isNewPlayer) {
      socket?.emit(NEW_PLAYER, codeRoom)
      setIsNewPlayer(false)
    }

    socket?.on(GET_CANVAS_STATE, (id: string) => {
      const dataImg = canvasRef.current.toDataURL()
      socket?.emit(CANVAS_STATE, { dataImg, id } as SocketGetCanvasState)
    })

    socket?.on(CANVAS_STATE_FROM_SERVER, (dataImg: string) => {
      const img = new Image()
      img.src = dataImg
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
    })

    return () => {
      socket?.off(GET_CANVAS_STATE)
      socket?.off(CANVAS_STATE_FROM_SERVER)
    }
  }, [ctx])


  return { handleMouseDown, handleMouseMove, handleMouseUpOrLeave };
}