import { useContext } from "react";
import { useSocketEvents } from "@/applications/play/shared/hooks/useSocketEvents";
import { PaintContext } from "@/applications/play/PlayingGameScreen.component";
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
import useDrawing from "@/applications/play/shared/hooks/useDrawing";
import {
  PEN_STYLE_BRUSH,
  PEN_STYLE_ERASER,
  PEN_STYLE_RECTANGLE,
  PEN_STYLE_CIRCLE,
  PEN_STYLE_TRIANGLE,
  PEN_STYLE_LINE,
} from "@/applications/play/shared/constants/penStyles";

export default function ToolBtns() {
  const variables = useContext(PaintContext);
  const {
    handleStartDraw,
    handleDrawing,
    handleFinishDraw,
    handleClearCanvas,
  } = useDrawing();
  const { handleClickClearCanvas } = useSocketEvents({
    handleStartDraw,
    handleDrawing,
    handleFinishDraw,
    handleClearCanvas,
  });

  if (!variables) return null;
  const { penStyle, isFill, setPenStyle, setIsFill } = variables;
  // Handlers
  const handleChoseBrush = () => {
    setPenStyle(PEN_STYLE_BRUSH);
  };
  const handleChoseEraser = () => {
    setPenStyle(PEN_STYLE_ERASER);
  };
  const handleChoseRectangle = () => {
    setPenStyle(PEN_STYLE_RECTANGLE);
  };
  const handleChoseCircle = () => {
    setPenStyle(PEN_STYLE_CIRCLE);
  };
  const handleChoseTriangle = () => {
    setPenStyle(PEN_STYLE_TRIANGLE);
  };
  const handleToggleFill = () => {
    setIsFill((prev: boolean) => !prev);
  };
  const handleChoseLine = () => {
    setPenStyle(PEN_STYLE_LINE);
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
        active={penStyle === PEN_STYLE_BRUSH}
        onChange={() => {
          handleChoseBrush();
        }}
        value={PEN_STYLE_BRUSH}
        type="radio"
      />
      <BtnChosePenStyle
        Icon={Eraser}
        active={penStyle === PEN_STYLE_ERASER}
        onChange={handleChoseEraser}
        value={PEN_STYLE_ERASER}
        type="radio"
      />
      <BtnChosePenStyle
        Icon={Square}
        active={penStyle === PEN_STYLE_RECTANGLE}
        onChange={handleChoseRectangle}
        value={PEN_STYLE_RECTANGLE}
        type="radio"
      />
      <BtnChosePenStyle
        Icon={Circle}
        active={penStyle === PEN_STYLE_CIRCLE}
        onChange={handleChoseCircle}
        value={PEN_STYLE_CIRCLE}
        type="radio"
      />
      <BtnChosePenStyle
        Icon={Triangle}
        active={penStyle === PEN_STYLE_TRIANGLE}
        onChange={handleChoseTriangle}
        value={PEN_STYLE_TRIANGLE}
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
        active={penStyle === PEN_STYLE_LINE}
        onChange={handleChoseLine}
        value={PEN_STYLE_LINE}
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
