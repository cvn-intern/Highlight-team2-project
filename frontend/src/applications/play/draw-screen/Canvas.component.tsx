/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from "react";
import { PaintContext } from "@/applications/play/PlayingGameScreen.component";
import cursorsIconMap from "../shared/constants/cursorsIconMap";
// Functions
import { ProgressPlayTime } from "@/shared/components/ProcessPlayTime";
import { useSocketHandleCanvasEvent } from "../shared/hooks/useSocketHandleCanvasEvents";
import { getPointFromEvent } from "./draw.helper";

const Canvas = ({ hidden = false, isDrawer = false }) => {
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const { canvasRef, penStyle } = variables;

  const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } =
    useSocketHandleCanvasEvent();

  return (
    <div
      className={` overflow-hidden rounded-[10px] w-[760px] aspect-[2] flex-shrink-0 ${
        hidden ? "absolute translate-y-[-10000px]" : "relative"
      }`}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        className={`w-[var(--canvas-width)] h-[var(--canvas-height)] bg-white rounded-[10px] ${
          cursorsIconMap[penStyle] ?? ""
        } ${!isDrawer && "pointer-events-none"}`}
        onMouseDown={(e) => {
          if (!isDrawer) return;
          const point = getPointFromEvent(e);
          handleMouseDown(point);
        }}
        onMouseMove={(e) => {
          if (!isDrawer) return;
          const currentPoint = getPointFromEvent(e);
          handleMouseMove(currentPoint);
        }}
        onMouseUp={() => {
          if (!isDrawer) return;
          handleMouseUpOrLeave();
        }}
        onMouseLeave={() => {
          if (!isDrawer) return;
          handleMouseUpOrLeave();
        }}
      ></canvas>
      <ProgressPlayTime />
    </div>
  );
};

export default Canvas;
