/* eslint-disable @typescript-eslint/no-unused-vars */
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
import BtnChosePenStyle from "./BtnChosePenStyle";
// Functions
// Components
import {
  Edit,
  Eraser,
  Square,
  Circle,
  Triangle,
  Minus,
  PaintBucket,
  Pipette,
  CopyX,
} from "lucide-react";
import { RgbaColorPicker } from "react-colorful";
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
  // Handlers
  const handleChoseBrush = () => {};
  const handleChoseEraser = () => {};
  const handleChoseRectangle = () => {};
  const handleChoseCircle = () => {};
  const handleChoseTriangle = () => {};
  const handleToggleFill = () => {};
  const handleChoseLine = () => {};
  const handleChoseBucket = () => {};
  const handleChoseColorPicker = () => {};
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
  return (
    <div className="w-[158px] rounded-md bg-white h-full p-4 flex flex-col justify-between">
      <div className="grid grid-cols-2 auto-rows-[44px] gap-[0.8px] bg-[var(--color-gray-cc)]">
        <BtnChosePenStyle
          Icon={Edit}
          active={penStyle === "brush"}
          onChange={handleChoseBrush}
          value="brush"
          type="radio"
        />
        <BtnChosePenStyle
          Icon={Eraser}
          active={penStyle === "eraser"}
          onChange={handleChoseEraser}
          value="eraser"
          type="radio"
        />
        <BtnChosePenStyle
          Icon={Square}
          active={penStyle === "rectangle"}
          onChange={handleChoseRectangle}
          value="eraser"
          type="radio"
        />
        <BtnChosePenStyle
          Icon={Circle}
          active={penStyle === "circle"}
          onChange={handleChoseCircle}
          value="eraser"
          type="radio"
        />
        <BtnChosePenStyle
          Icon={Triangle}
          active={penStyle === "triangle"}
          onChange={handleChoseTriangle}
          value="triangle"
          type="radio"
        />
        <BtnChosePenStyle
          Icon={"fill"}
          active={isFill}
          onChange={handleToggleFill}
          name="fill"
          value="fill"
          type="checkbox"
        />
        <BtnChosePenStyle
          Icon={Minus}
          active={penStyle === "line"}
          onChange={handleChoseLine}
          value="line"
          type="radio"
        />
        <BtnChosePenStyle
          Icon={PaintBucket}
          active={penStyle === "bucket"}
          onChange={handleChoseBucket}
          value="bucket"
          type="radio"
        />
        <BtnChosePenStyle
          Icon={Pipette}
          active={penStyle === "picker"}
          onChange={handleChoseColorPicker}
          value="picker"
          type="radio"
        />
        <div className="bg-white flexCenter">
          <CopyX color={"#848484"} size={28} strokeWidth={2} />
        </div>
      </div>
      {/* Color Picker */}
      <RgbaColorPicker color={color} onChange={setColor} />
      {/* Slider */}
      <input
        type="range"
        min="1"
        max="100"
        value={brushSize}
        onChange={(e) => {
          setBrushSize(Number(e.target.value));
        }}
      ></input>
      {/* Buttons */}
      <button
        className="px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent"
        onClick={handleSaveCanvasAsImage}
      >
        Export
      </button>
    </div>
  );
}
