import { MouseEvent, useContext } from "react";
import { PaintContext } from "@/pages/play";
// Functions
import {
  drawRectangle,
  drawCircle,
  drawTriangle,
  drawFreeStyle,
  eraser,
  fillWithColor,
  pickColor,
} from "@/pages/play/helpers";
import { rgbaToHex } from "@/common/lib/colors";

// type Props = {}

export default function Main() {
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const {
    canvasRef,
    ctx,
    snapshot,
    isDrawing,
    startX,
    startY,
    color,
    penStyle,
    isFill,
    brushSize,
    setSnapshot,
    setIsDrawing,
    setStartX,
    setStartY,
    setColor,
  } = variables;
  const handleStartDrawing = (
    e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    if (penStyle === "bucket") {
      fillWithColor(ctx, e, color);
      return;
    }
    setIsDrawing(true);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setStartX(x);
    setStartY(y);
    const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
    ctx.fillStyle = hexColor;
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = brushSize;
    // Pick color
    if (penStyle === "picker") {
      // alert("picker");
      pickColor(ctx, x, y, setColor);
      return;
    }
    // Save previous state to prevent drag image
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.beginPath();
    // Make a dot
    (penStyle === "brush" || penStyle === "circle") &&
      drawFreeStyle(ctx, e, color);
    penStyle === "eraser" && eraser(ctx, e);
  };
  const handleDrawing = (
    e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => {
    if (!ctx || !isDrawing) return;
    if (penStyle === "brush") {
      drawFreeStyle(ctx, e, color);
    }
    if (penStyle === "eraser") {
      eraser(ctx, e);
    }
    if (penStyle === "rectangle") {
      snapshot && drawRectangle(ctx, snapshot, e, startX, startY, isFill);
    }
    if (penStyle === "circle") {
      snapshot && drawCircle(ctx, snapshot, e, startX, startY, isFill);
    }
    if (penStyle === "triangle") {
      snapshot && drawTriangle(ctx, snapshot, e, startX, startY, isFill);
    }
  };
  const handleFinishDrawing = (
    e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    setIsDrawing(false);
    // Save previous state to restore when resize
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };
  return (
    <div className="flex flex-col flex-1 h-full gap-6">
      <div className="flex-1 rounded-md overflow-hidden relative">
        <canvas
          ref={canvasRef}
          id="canvas"
          className="w-full h-full bg-white"
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDrawing}
          onMouseUp={handleFinishDrawing}
          onMouseLeave={handleFinishDrawing}
        ></canvas>
      </div>
      <div className="bg-white rounded-md h-[245px]">Chat and answers</div>
    </div>
  );
}
