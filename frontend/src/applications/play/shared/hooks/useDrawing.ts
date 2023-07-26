/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaintContext } from "@/applications/play/PlayingGameScreen.component";
import {
  drawCircle,
  drawFreeStyle,
  drawLine,
  drawRectangle,
  drawTriangle,
  eraser,
  fillWithColor,
  pickColor,
  resetCanvas,
} from "@/applications/play/draw-screen/draw.helper";
import { useContext } from "react";
import { rgbaToHex } from "@/shared/lib/colors";
import {
  Drawing,
  StartDraw,
  UseDrawingCustomHook,
} from "@/applications/play/draw-screen/draw";
import {
  PEN_STYLE_BRUSH,
  PEN_STYLE_ERASER,
  PEN_STYLE_RECTANGLE,
  PEN_STYLE_CIRCLE,
  PEN_STYLE_TRIANGLE,
  PEN_STYLE_LINE,
} from "@/applications/play/shared/constants/penStyles";

const useDrawing = (): UseDrawingCustomHook => {
  let handleStartDraw = (_: StartDraw) => {};
  let handleDrawing = (_: Drawing) => {};
  let handleFinishDraw = () => {};
  let handleClearCanvas = () => {};

  const variables = useContext(PaintContext);
  if (!variables)
    return {
      handleStartDraw,
      handleDrawing,
      handleFinishDraw,
      handleClearCanvas,
    };
  const {
    ctx,
    isDrawing,
    previousPoint,
    setSnapshot,
    setIsDrawing,
    setPreviousPoint,
    setColor,
  } = variables || {};

  handleStartDraw = ({
    point,
    color,
    penStyle,
    brushSize,
    ctx,
  }: StartDraw): void => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    if (penStyle === "bucket") {
      fillWithColor(ctx, point, color);
      return;
    }
    setIsDrawing(true);
    setPreviousPoint(point);
    const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
    ctx.fillStyle = hexColor;
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = brushSize;
    if (penStyle === "picker") {
      pickColor(ctx, point, setColor);
      return;
    }
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.beginPath();
    penStyle === PEN_STYLE_BRUSH && drawFreeStyle(ctx, point, color);
    penStyle === PEN_STYLE_ERASER && eraser(ctx, point);
  };

  handleDrawing = ({
    currentPoint,
    color,
    penStyle,
    snapshot,
    isFill,
    ctx,
  }: Drawing): void => {
    if (!ctx || !isDrawing) return;
    if (penStyle === PEN_STYLE_BRUSH) {
      drawFreeStyle(ctx, currentPoint, color);
    }
    if (penStyle === PEN_STYLE_ERASER) {
      eraser(ctx, currentPoint);
    }
    if (!snapshot) return;
    if (penStyle === PEN_STYLE_RECTANGLE) {
      drawRectangle(ctx, snapshot, currentPoint, previousPoint, isFill);
    }
    if (penStyle === PEN_STYLE_CIRCLE) {
      drawCircle(ctx, snapshot, currentPoint, previousPoint, isFill);
    }
    if (penStyle === PEN_STYLE_TRIANGLE) {
      drawTriangle(ctx, snapshot, currentPoint, previousPoint, isFill);
    }
    if (penStyle === PEN_STYLE_LINE) {
      drawLine(ctx, snapshot, currentPoint, previousPoint);
    }
  };

  handleFinishDraw = (): void => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    setIsDrawing(false);
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  handleClearCanvas = (): void => {
    if (!ctx) return;
    resetCanvas(ctx);
  };

  return {
    handleStartDraw,
    handleDrawing,
    handleFinishDraw,
    handleClearCanvas,
  };
};

export default useDrawing;
