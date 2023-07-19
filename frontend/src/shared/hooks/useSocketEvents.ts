
import { useContext, useEffect } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { PaintContext } from "@/applications/play/Play";
import { Drawing, Point, SocketDrawing, SocketStartDraw, StartDraw } from "@/applications/play/draw";
import useDrawing from "./useCanvasEvents";
import { CLEAR_CANVAS, DRAWING, FINISH_DRAW, OTHER_CLEAR_CANVAS, OTHER_DRAWING, OTHER_FINISH_DRAW, OTHER_START_DRAW, START_DRAW } from "@/applications/play/constants/drawEvent";


export function useSocket() {
    const variables = useContext(PaintContext);
    if (!variables) return null;
    const {
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
      handleStartDraw({ point, color, penStyle, brushSize } as StartDraw);
    };
  
    const handleMouseMove = (currentPoint: Point) => {
      if (isDrawing) {
        socket?.emit(DRAWING, { currentPoint, penStyle, color, isFill } as SocketDrawing);
        snapshot && handleDrawing({ currentPoint, color, penStyle, snapshot, isFill } as Drawing);
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
      socket?.on(OTHER_START_DRAW, ({ point, color, penStyle, brushSize }: StartDraw) => {
        handleStartDraw({ point, color, penStyle, brushSize });
      });

      socket?.on(OTHER_DRAWING, ({ currentPoint, color, penStyle, isFill }: Drawing) => {
        snapshot && handleDrawing({ currentPoint, color, penStyle, snapshot, isFill });
      });

      socket?.on(OTHER_FINISH_DRAW, () => {
        handleFinishDraw()
      });

      socket?.on(OTHER_CLEAR_CANVAS, () => {
        handleClearCanvas()
      });
  
      return () => {
        socket?.off(OTHER_START_DRAW);
        socket?.off(OTHER_DRAWING);
        socket?.off(OTHER_FINISH_DRAW);
        socket?.off(OTHER_CLEAR_CANVAS);
      };
    }, [canvasRef, snapshot]);
  
    return { handleMouseDown, handleMouseMove, handleMouseUpOrLeave, handleClickClearCanvas };
  }