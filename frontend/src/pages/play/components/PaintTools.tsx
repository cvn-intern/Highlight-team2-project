import { useContext, MouseEvent } from "react";
import { PaintContext } from "@/pages/play";
import {
  drawFreeStyle,
  eraser,
  fillWithColor,
  pickColor,
  resetCanvas,
  drawRectangle,
  drawCircle,
  drawTriangle,
} from "@/pages/play/helpers";
import { rgbaToHex } from "@/common/lib/colors";
// Functions

// type Props = {}

export default function PaintTools() {
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
    setCtx,
    setSnapshot,
    setIsDrawing,
    setStartX,
    setStartY,
    setColor,
    setPenStyle,
    setIsFill,
    setBrushSize,
  } = variables;
  const handleClearCanvas = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (!ctx) return;
    resetCanvas(ctx);
  };
  const handleSaveCanvasAsImage = (e: MouseEvent<HTMLButtonElement, any>) => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvas.toDataURL();
    link.click();
  };
  return <div className="w-[158px] rounded-md bg-white h-full"></div>;
}
