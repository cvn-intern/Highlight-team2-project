/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { PaintContext } from "@/applications/play/PlayingGameScreen";
import {
  Drawing,
  Point,
  StartDraw,
  UseDrawingCustomHook,
  UseSocketCustomHook,
} from "@/applications/play/draw_screen/draw";
import {
  CANVAS_STATE,
  CANVAS_STATE_FROM_SERVER,
  CLEAR_CANVAS,
  DRAWER_CLEAR_CANVAS,
  DRAWER_DRAWING,
  DRAWER_FINISH_DRAWING,
  DRAWER_START_DRAWING,
  DRAWING,
  FINISH_DRAW,
  GET_CANVAS_STATE,
  NEW_PLAYER,
  START_DRAW,
} from "@/applications/play/shared/constants/drawEvent";
import { useParams } from "react-router";

export function useSocketEvents({
  handleStartDraw,
  handleDrawing,
  handleFinishDraw,
  handleClearCanvas,
}: UseDrawingCustomHook): UseSocketCustomHook {
  let handleMouseDown = (_: Point) => {};
  let handleMouseMove = (_: Point) => {};
  let handleMouseUpOrLeave = () => {};
  let handleClickClearCanvas = () => {};
  const DEFAULT_RETURN = {
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
    handleClickClearCanvas,
  };

  const variables = useContext(PaintContext);
  if (!variables) return DEFAULT_RETURN;
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
  const { codeRoom } = useParams();

  handleMouseDown = (point: Point) => {
    socket?.emit(START_DRAW, {
      codeRoom,
      point,
      color,
      penStyle,
      brushSize,
    });
    ctx && handleStartDraw({ point, color, penStyle, brushSize, ctx });
  };

  handleMouseMove = (currentPoint: Point) => {
    if (isDrawing) {
      socket?.emit(DRAWING, {
        codeRoom,
        currentPoint,
        penStyle,
        color,
        isFill,
      });
      snapshot &&
        ctx &&
        handleDrawing({
          currentPoint,
          color,
          penStyle,
          snapshot,
          isFill,
          ctx,
        });
    }
  };

  handleMouseUpOrLeave = () => {
    socket?.emit(FINISH_DRAW, codeRoom);
    handleFinishDraw();
  };

  handleClickClearCanvas = () => {
    socket?.emit(CLEAR_CANVAS, codeRoom);
    handleClearCanvas();
  };

  useEffect(() => {
    socket?.on(
      DRAWER_START_DRAWING,
      ({ point, color, penStyle, brushSize }: StartDraw) => {
        ctx && handleStartDraw({ point, color, penStyle, brushSize, ctx });
      }
    );

    socket?.on(
      DRAWER_DRAWING,
      ({ currentPoint, color, penStyle, isFill }: Drawing) => {
        snapshot &&
          ctx &&
          handleDrawing({
            currentPoint,
            color,
            penStyle,
            snapshot,
            isFill,
            ctx,
          });
      }
    );

    socket?.on(DRAWER_FINISH_DRAWING, () => {
      handleFinishDraw();
    });

    socket?.on(DRAWER_CLEAR_CANVAS, () => {
      handleClearCanvas();
    });

    return () => {
      socket?.off(DRAWER_START_DRAWING);
      socket?.off(DRAWER_DRAWING);
      socket?.off(DRAWER_FINISH_DRAWING);
      socket?.off(DRAWER_CLEAR_CANVAS);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, snapshot]);

  useEffect(() => {
    socket?.emit(NEW_PLAYER, codeRoom);

    socket?.on(GET_CANVAS_STATE, (id: string) => {
      const dataImg = canvasRef.current.toDataURL();
      socket?.emit(CANVAS_STATE, {
        codeRoom,
        dataImg,
        id,
      });
    });

    socket?.on(CANVAS_STATE_FROM_SERVER, (dataImg: string) => {
      const img = new Image();

      img.src = dataImg;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });
    return () => {
      socket?.off(GET_CANVAS_STATE);
      socket?.off(CANVAS_STATE_FROM_SERVER);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
    handleClickClearCanvas,
  };
}
