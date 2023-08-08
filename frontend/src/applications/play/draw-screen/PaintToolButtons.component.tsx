import { useContext } from "react";
import { PaintContext } from "@/applications/play/PlayingGameScreen.component";
import ButtonChosePenStyle from "./ButtonChosePenStyle.component";
import { CopyX } from "lucide-react";
import AlertDialogYesNo from "@/shared/components/AlertDialogYesNo";
import AlertIcon from "@/shared/components/icons/AlertIcon";
import { useSocketClearCanvasEvent } from "../shared/hooks/useSocketClearCanvasEvent";

import { BUTTONS1, BUTTONS2 } from "./constants";

export default function PaintToolButtons() {
  const variables = useContext(PaintContext);
  const { handleClickClearCanvas } = useSocketClearCanvasEvent();

  if (!variables) return null;

  const { penStyle, isFill, setPenStyle, setIsFill } = variables;
  // Handlers
  const handleToggleFill = () => {
    setIsFill((prev: boolean) => !prev);
  };
  return (
    <div className="grid grid-cols-2 auto-rows-[44px] gap-[1px] bg-[var(--color-gray-cc)]">
      {BUTTONS1.map((button, index) => (
        <ButtonChosePenStyle
          key={index}
          Icon={button.Icon}
          active={penStyle === button.penStyle}
          onChange={() => {
            setPenStyle(button.penStyle);
          }}
          value={button.penStyle}
          type="radio"
        />
      ))}
      <ButtonChosePenStyle
        Icon={"fill"}
        active={isFill}
        onChange={handleToggleFill}
        name="fill"
        value="fill"
        type="checkbox"
      />
      {BUTTONS2.map((button, index) => (
        <ButtonChosePenStyle
          key={index}
          Icon={button.Icon}
          active={penStyle === button.penStyle}
          onChange={() => {
            setPenStyle(button.penStyle);
          }}
          value={button.penStyle}
          type="radio"
        />
      ))}
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
