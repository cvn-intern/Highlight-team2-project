import { useContext } from "react";
import { PaintContext } from "@/pages/play";
import { resetCanvas } from "@/pages/play/helpers";
import BtnChosePenStyle from "./BtnChosePenStyle";
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

export default function PaintTools() {
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const {
    ctx,
    color,
    penStyle,
    isFill,
    brushSize,
    setColor,
    setPenStyle,
    setIsFill,
    setBrushSize,
  } = variables;
  // Handlers
  const handleChoseBrush = () => {
    setPenStyle("brush");
  };
  const handleChoseEraser = () => {
    setPenStyle("eraser");
  };
  const handleChoseRectangle = () => {
    setPenStyle("rectangle");
  };
  const handleChoseCircle = () => {
    setPenStyle("circle");
  };
  const handleChoseTriangle = () => {
    setPenStyle("triangle");
  };
  const handleToggleFill = () => {
    setIsFill((prev: boolean) => !prev);
  };
  const handleChoseLine = () => {
    setPenStyle("line");
  };
  const handleChoseBucket = () => {
    setPenStyle("bucket");
  };
  const handleChoseColorPicker = () => {
    setPenStyle("picker");
  };
  const handleClearCanvas = () => {
    if (!ctx) return;
    resetCanvas(ctx);
  };
  const handleSaveCanvasAsImage = () => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvas.toDataURL();
    link.click();
  };
  // Renders
  const toolsBtn = (
    <div className="grid grid-cols-2 auto-rows-[44px] gap-[1px] bg-[var(--color-gray-cc)]">
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
        value="rectangle"
        type="radio"
      />
      <BtnChosePenStyle
        Icon={Circle}
        active={penStyle === "circle"}
        onChange={handleChoseCircle}
        value="circle"
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
      <button
        className="bg-white flexCenter cursor-pointer"
        onClick={handleClearCanvas}
      >
        <CopyX color={"#848484"} size={28} strokeWidth={2} />
      </button>
    </div>
  );
  return (
    <div className="w-[158px] rounded-md bg-white h-full p-4 flex flex-col justify-between">
      {toolsBtn}
      <RgbaColorPicker color={color} onChange={setColor} />
      <input
        type="range"
        min="1"
        max="100"
        value={brushSize}
        onChange={(e) => {
          setBrushSize(Number(e.target.value));
        }}
      ></input>
      <button
        className="px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent"
        onClick={handleSaveCanvasAsImage}
      >
        Export
      </button>
    </div>
  );
}
