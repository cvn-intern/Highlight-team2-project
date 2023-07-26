/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from "react";
import { PaintContext } from "@/applications/play/Play";
import cursorsIconMap from "./constants/cursorsIconMap";
// Functions
import { getPointFromEvent } from "@/applications/play/draw.helper";
import { ProgressPlayTime } from "@/shared/components/ProcessPlayTime";
import { useSocketHandleCanvasEvent } from "./hooks/useSocketHandleCanvasEvents";


const Canvas = () => {
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const { canvasRef, penStyle } = variables;

  const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } = useSocketHandleCanvasEvent()

  return (
    <div className={`relative overflow-hidden rounded-[10px] w-[760px] aspect-[2] flex-shrink-0`}>
      <canvas
        ref={canvasRef}
        id="canvas"
        className={`w-[var(--canvas-width)] h-[var(--canvas-height)] bg-white rounded-[10px] ${cursorsIconMap[penStyle] ?? ""
          }`}
        onMouseDown={(e) => {
          const point = getPointFromEvent(e);
          handleMouseDown(point);
        }}
        onMouseMove={(e) => {
          const currentPoint = getPointFromEvent(e);
          handleMouseMove(currentPoint);
        }}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      ></canvas>
      <ProgressPlayTime />
    </div>
  );
};

export default Canvas;
