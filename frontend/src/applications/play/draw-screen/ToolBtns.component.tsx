import { useContext } from "react";
import BtnChosePenStyle from "./BtnChosePenStyle.component";
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
import { useSocketClearCanvasEvent } from "../shared/hooks/useSocketClearCanvasEvent";
import { PaintContext } from "../PlayingGameScreen.component";

export default function ToolBtns() {
  const { handleClickClearCanvas } = useSocketClearCanvasEvent()

  const variables = useContext(PaintContext);
  if (!variables) return null;
  const { penStyle, isFill, setPenStyle, setIsFill } = variables;
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
  return (
    <div className="grid grid-cols-2 auto-rows-[44px] gap-[1px] bg-[var(--color-gray-cc)]">
      <BtnChosePenStyle
        Icon={Edit}
        active={penStyle === "brush"}
        onChange={() => {
          handleChoseBrush();
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
        onYesClick={handleClickClearCanvas}
        Icon={AlertIcon}
        confirmText="Yes"
        cancelText="No"
        alertMessage="Are you sure to clear your canvas? This action cannot be undone."
      />
    </div>
  );
}
