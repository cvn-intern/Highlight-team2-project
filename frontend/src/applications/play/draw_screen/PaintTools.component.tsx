import { useContext } from "react";
import { PaintContext } from "@/applications/play/PlayingGameScreen";
// Components
import ColorPicker from "./ColorPicker.component";
import ToolBtns from "./ToolBtns.component";

export default function PaintTools() {
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const { ctx, brushSize, setBrushSize } = variables;
  const handleSaveCanvasAsImage = () => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvas.toDataURL();
    link.click();
  };
  return (
    <div className="w-[var(--tool-section-width)] rounded-[10px] bg-white h-full p-4 flex flex-col justify-between">
      <ToolBtns />
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
