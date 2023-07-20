import { PaintContext } from "@/applications/play/Play";
import { drawCircle, drawFreeStyle, drawLine, drawRectangle, drawTriangle, eraser, fillWithColor, pickColor, resetCanvas } from "@/applications/play/draw.helper";
import { useContext } from "react";
import { rgbaToHex } from "../lib/colors";
import { Drawing, StartDraw, useDrawingCustomHook } from "@/applications/play/draw";


const useDrawing = (): useDrawingCustomHook => {
  let handleStartDraw = (_: StartDraw) => {}
  let handleDrawing = (_: Drawing) => {}
  let handleFinishDraw = () => {}
  let handleClearCanvas = () => {}
  
    const variables = useContext(PaintContext);
    if (!variables) return { handleStartDraw, handleDrawing, handleFinishDraw, handleClearCanvas };
    const {
      ctx,
      isDrawing,
      previousPoint,
      setSnapshot,
      setIsDrawing,
      setPreviousPoint,
      setColor,
    } = variables || {};
  
    handleStartDraw = ({ point, color, penStyle, brushSize, ctx }: StartDraw): void => {
      
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
      (penStyle === "brush") && drawFreeStyle(ctx, point, color);
      penStyle === "eraser" && eraser(ctx, point);
    };
  
    handleDrawing = ({ currentPoint, color, penStyle, snapshot, isFill, ctx }: Drawing): void => {
      
      if (!ctx || !isDrawing) return;
      if (penStyle === "brush") {
        drawFreeStyle(ctx, currentPoint, color);
      }
      if (penStyle === "eraser") {
        eraser(ctx, currentPoint);
      }
      if (!snapshot) return;
      if (penStyle === "rectangle") {
        drawRectangle(ctx, snapshot, currentPoint, previousPoint, isFill);
      }
      if (penStyle === "circle") {
        drawCircle(ctx, snapshot, currentPoint, previousPoint, isFill);
      }
      if (penStyle === "triangle") {
        drawTriangle(ctx, snapshot, currentPoint, previousPoint, isFill);
      }
      if (penStyle === "line") {
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
    }
  
    return { handleStartDraw, handleDrawing, handleFinishDraw, handleClearCanvas };
  }

  export default useDrawing