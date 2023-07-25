import { useContext, useRef, useState } from "react";
import paletteImage from "@/shared/assets/palette.svg";
import { palette } from "../shared/constants/color";
import { PaintContext } from "@/applications/play/PlayingGameScreen";
import { hexToRGBA, rgbaToHex } from "@/shared/lib/colors";
import { RgbaColorPicker } from "react-colorful";
import classNames from "classnames";
import useOnClickOutside from "@/shared/hooks/useOnClickOutSide";

// type Props = {}

export default function ColorPicker() {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(pickerRef, () => {
    setShowPallete(false);
  });
  const [showPallete, setShowPallete] = useState(false);
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const { color, setColor } = variables;
  const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
  return (
    <>
      <div className="grid grid-cols-4 gap-1">
        {palette.map((colour) => {
          const isActive = colour === hexColor.slice(0, 7);
          return (
            <div
              key={colour}
              className={`w-full h-[30px] rounded-[4px] shadow-md cursor-pointer border-2 border-transparent ${classNames(
                { "border-[#ffc26f]": isActive }
              )}`}
              style={{ backgroundColor: colour }}
              onClick={() => {
                const rgbaColor = hexToRGBA(colour);
                setColor(rgbaColor);
              }}
            ></div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div
          className={`border-2 rounded-[4px] shadow-md aspect-square border-blue-400`}
          style={{ backgroundColor: hexColor }}
        ></div>
        <div className="relative cursor-pointer aspect-square" ref={pickerRef}>
          <img
            src={paletteImage}
            alt=""
            className="object-cover w-full h-full"
            onClick={() => setShowPallete((prev) => !prev)}
          />
          {showPallete && (
            <div className="absolute top-0 left-0 -translate-x-28 -translate-y-[80%] w-[100px]">
              <RgbaColorPicker color={color} onChange={setColor} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
