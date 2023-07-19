import { MouseEvent, useContext } from "react";
import { PaintContext } from "@/applications/play/Play";
import cursorsIconMap from "./constants/cursorsIconMap";
// Functions
import {
  drawRectangle,
  drawCircle,
  drawTriangle,
  drawFreeStyle,
  eraser,
  fillWithColor,
  pickColor,
  drawLine,
} from "@/applications/play/draw.helper";
// Types
import { rgbaToHex } from "@/shared/lib/colors";
import { Drawing, Point, StartDraw } from "./draw";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useSocketEvents } from "@/shared/hooks/useSocketEvents";
import { OTHER_DRAWING, OTHER_FINISH_DRAW, OTHER_START_DRAW } from "./constants/drawEvent";

export default function Canvas() {
  const variables = useContext(PaintContext);
  const {socket} = useSocketStore()
  if (!variables) return null;
  const {
    canvasRef,
    ctx,
    snapshot,
    isDrawing,
    previousPoint,
    color,
    penStyle,
    isFill,
    brushSize,
    setSnapshot,
    setIsDrawing,
    setPreviousPoint,
    setColor,
  } = variables;
  // Handlers
  const getPointFromEvent = (
    e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ): Point => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    return { x, y };
  };
  const handleStartDrawing = ({point, color, penStyle, brushSize}: StartDraw) => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    if (penStyle === "bucket") {
      fillWithColor(ctx, point, color);
      return;
    }
    setIsDrawing(true);
    setPreviousPoint(point);
    const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
    ctx.fillStyle = hexColor;
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = brushSize;
    // Pick color
    if (penStyle === "picker") {
      // alert("picker");
      pickColor(ctx, point, setColor);
      return;
    }
    // Save previous state to prevent drag image
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.beginPath();
    // Make a dot
    (penStyle === "brush" || penStyle === "circle") &&
      drawFreeStyle(ctx, point, color);
    penStyle === "eraser" && eraser(ctx, point);
  };

  const handleDrawing = ({currentPoint, color, penStyle, snapshot, isFill}: Drawing) => {
    if (!ctx || !isDrawing) return;
    if (penStyle === "brush") {
      drawFreeStyle(ctx, currentPoint, color);
    }
    if (penStyle === "eraser") {
      eraser(ctx, currentPoint);
    }
    if (!snapshot) return;
    if (penStyle === "rectangle") {
      drawRectangle(ctx, snapshot, currentPoint, previousPoint, isFill);
    }
    if (penStyle === "circle") {
      drawCircle(ctx, snapshot, currentPoint, previousPoint, isFill);
    }
    if (penStyle === "triangle") {
      drawTriangle(ctx, snapshot, currentPoint, previousPoint, isFill);
    }
    if (penStyle === "line") {
      drawLine(ctx, snapshot, currentPoint, previousPoint);
    }
  };
  const handleFinishDrawing = () => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    setIsDrawing(false);
    // Save previous state to restore when resize
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };


  //Socket handle
  const handleSocketStartDraw = ({point, color, penStyle, brushSize}: StartDraw) => {
    socket?.emit("start-drawing", { point, color, penStyle, brushSize });
    handleStartDrawing({point, color, penStyle, brushSize})
  }

  const handleSocketDrawing = ({currentPoint ,color ,penStyle , snapshot, isFill}: Drawing) => {
    
    if(isDrawing){
      socket?.emit("drawing", { currentPoint, penStyle, color, isFill });
      snapshot && handleDrawing({currentPoint, color, penStyle, snapshot, isFill})
    }
  }

  const handleSocketFinishDraw = () => {
    
    socket?.emit("finish-drawing");
    handleFinishDrawing()
  }

  // useEffect(() => {

    useSocketEvents(OTHER_START_DRAW, (data: StartDraw) => handleStartDrawing(data))
    useSocketEvents(OTHER_DRAWING, (data: Drawing) => handleDrawing(data))
    useSocketEvents(OTHER_FINISH_DRAW, () => handleFinishDrawing())
 
  // }, [canvasRef, snapshot])


  return (
    <div
      className={`relative overflow-hidden rounded-[10px] w-[760px] aspect-[2] flex-shrink-0`}
    >
      <canvas
          ref={canvasRef}
          id="canvas"
          className={`w-[var(--canvas-width)] h-[var(--canvas-height)] bg-white rounded-[10px] ${cursorsIconMap[penStyle] ?? ""
          }`}
          onMouseDown={(e) =>{
            const point = getPointFromEvent(e)
             handleSocketStartDraw({point, color, penStyle, brushSize})
            }}
          onMouseMove={(e) => {
            const currentPoint = getPointFromEvent(e)
            handleSocketDrawing({currentPoint, color, penStyle, snapshot, isFill})
          }}
          onMouseUp={handleSocketFinishDraw}
          onMouseLeave={handleSocketFinishDraw}
        ></canvas>
    </div>
  );
}