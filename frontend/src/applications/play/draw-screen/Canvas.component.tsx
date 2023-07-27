/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from "react";
import { PaintContext } from "@/applications/play/PlayingGameScreen.component";
import cursorsIconMap from "../shared/constants/cursorsIconMap";
// Functions
import { ProgressPlayTime } from "@/shared/components/ProcessPlayTime";
import { useSocketHandleCanvasEvent } from "../shared/hooks/useSocketHandleCanvasEvents";
import { getPointFromEvent } from "./draw.helper";



const Canvas = ({hidden = false}) => {
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const { canvasRef, penStyle } = variables;

  const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } = useSocketHandleCanvasEvent()

  return (
    <div
      className={`relative overflow-hidden rounded-[10px] w-[760px] aspect-[2] flex-shrink-0`}
      hidden={hidden}
    >
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
