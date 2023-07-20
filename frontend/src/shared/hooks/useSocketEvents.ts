
import { useContext, useEffect } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { PaintContext } from "@/applications/play/Play";
import { Drawing, Point, SocketDrawing, SocketStartDraw, StartDraw } from "@/applications/play/draw";
import useDrawing from "./useCanvasEvents";
import { CANVAS_STATE, CANVAS_STATE_FROM_SERVER, CLEAR_CANVAS, DRAWING, FINISH_DRAW, GET_OTHER_CANVAS_STATE, NEW_PLAYER, OTHER_CLEAR_CANVAS, OTHER_DRAWING, OTHER_FINISH_DRAW, OTHER_START_DRAW, START_DRAW } from "@/applications/play/constants/drawEvent";


export function useSocket() {
    const variables = useContext(PaintContext);
    if (!variables) return null;
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

    const { handleStartDraw, handleDrawing, handleFinishDraw, handleClearCanvas } = useDrawing() as {
        handleStartDraw(data: StartDraw): void;
        handleDrawing(data: Drawing): void;
        handleFinishDraw(): void;
        handleClearCanvas(): void;
    }
  
    const handleMouseDown = (point: Point) => {
      socket?.emit(START_DRAW, { point, color, penStyle, brushSize } as SocketStartDraw);
      handleStartDraw({ point, color, penStyle, brushSize, ctx } as StartDraw);
    };
  
    const handleMouseMove = (currentPoint: Point) => {
      if (isDrawing) {
        socket?.emit(DRAWING, { currentPoint, penStyle, color, isFill } as SocketDrawing);
        snapshot && handleDrawing({ currentPoint, color, penStyle, snapshot, isFill, ctx } as Drawing);
      }
    };
  
    const handleMouseUpOrLeave = () => {
      socket?.emit(FINISH_DRAW);
      handleFinishDraw();
    };

    const handleClickClearCanvas = () => {
        socket?.emit(CLEAR_CANVAS)
        handleClearCanvas()
    }
  
    useEffect(() => {
      socket?.emit(NEW_PLAYER)

      socket?.on(OTHER_START_DRAW, ({ point, color, penStyle, brushSize }: StartDraw) => {
       ctx && handleStartDraw({ point, color, penStyle, brushSize, ctx });
      });

      socket?.on(OTHER_DRAWING, ({ currentPoint, color, penStyle, isFill }: Drawing) => {
        snapshot && ctx && handleDrawing({ currentPoint, color, penStyle, snapshot, isFill, ctx });
      });

      socket?.on(OTHER_FINISH_DRAW, () => {
        handleFinishDraw()
      });

      socket?.on(OTHER_CLEAR_CANVAS, () => {
        handleClearCanvas()
      });

      socket?.on(GET_OTHER_CANVAS_STATE, (id: string) => {
        const dataImg = canvasRef.current.toDataURL()
        socket?.emit(CANVAS_STATE, {dataImg, id})
      })

      socket?.on(CANVAS_STATE_FROM_SERVER, (dataImg: string) => {
        const img = new Image()
        img.src = dataImg
        img.onload = () => {
          ctx?.drawImage(img, 0, 0)
        }
      })

  
      return () => {
        socket?.off(OTHER_START_DRAW);
        socket?.off(OTHER_DRAWING);
        socket?.off(OTHER_FINISH_DRAW);
        socket?.off(OTHER_CLEAR_CANVAS);
        socket?.off(GET_OTHER_CANVAS_STATE)
        socket?.off(CANVAS_STATE_FROM_SERVER)
      };
    }, [canvasRef, snapshot, ctx]);

  
    return { handleMouseDown, handleMouseMove, handleMouseUpOrLeave, handleClickClearCanvas };
  }