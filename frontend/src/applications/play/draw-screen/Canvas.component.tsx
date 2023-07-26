/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from "react";
import { PaintContext } from "@/applications/play/PlayingGameScreen.component";
import cursorsIconMap from "../shared/constants/cursorsIconMap";
// Functions
import { getPointFromEvent } from "@/applications/play/draw-screen/draw.helper";
import { useSocketEvents } from "@/applications/play/shared/hooks/useSocketEvents";
import useDrawing from "@/applications/play/shared/hooks/useDrawing";
import { ProgressPlayTime } from "@/shared/components/ProcessPlayTime";

const Canvas = ({hidden = false}) => {
  const variables = useContext(PaintContext);
  const {
    handleStartDraw,
    handleDrawing,
    handleFinishDraw,
    handleClearCanvas,
  } = useDrawing();
  const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } =
    useSocketEvents({
      handleStartDraw,
      handleDrawing,
      handleFinishDraw,
      handleClearCanvas,
    });

  if (!variables) return null;
  const { canvasRef, penStyle } = variables;

  return (
    <div
      className={`relative overflow-hidden rounded-[10px] w-[760px] aspect-[2] flex-shrink-0`}
      hidden={hidden}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        className={`w-[var(--canvas-width)] h-[var(--canvas-height)] bg-white rounded-[10px] ${
          cursorsIconMap[penStyle] ?? ""
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
