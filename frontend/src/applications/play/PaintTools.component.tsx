import { useContext } from "react";
import { PaintContext } from "@/applications/play/Play";
import { resetCanvas } from "@/applications/play/draw.helper";
import BtnChosePenStyle from "./BtnChosePenStyle.component";
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
import AlertDialogYesNo from "@/shared/components/AlertDialogYesNo";
import AlertIcon from "@/shared/components/icons/AlertIcon";
import ColorPicker from "./ColorPicker.component";

export default function PaintTools() {
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const {
    ctx,
    penStyle,
    isFill,
    brushSize,
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
        onChange={() => {
          handleChoseBrush();
          console.log(penStyle);
        }}
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
      <AlertDialogYesNo
        buttonContent={<CopyX color={"#848484"} size={28} strokeWidth={2} />}
        buttonVariant={"link"}
        buttonClassName="bg-white flexCenter cursor-pointer w-full h-full rounded-none"
        onYesClick={handleClearCanvas}
        Icon={AlertIcon}
        confirmText="Yes"
        cancelText="No"
        alertMessage="Are you sure to clear your canvas? This action cannot be undone."
      />
    </div>
  );
  return (
    <div className="w-[var(--tool-section-width)] rounded-[10px] bg-white h-full p-4 flex flex-col justify-between">
      {toolsBtn}
      <ColorPicker />
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
