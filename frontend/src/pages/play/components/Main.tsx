import { MouseEvent, useContext, useEffect} from "react";
import { PaintContext } from "@/pages/play";
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
} from "@/pages/play/helpers";
import { rgbaToHex } from "@/common/lib/colors";
import { io } from 'socket.io-client';
import { Point } from "../config/types";
import BoxChatAnswer from "./BoxChatAnswer";
import { useSocketStore } from "@/common/stores/socketStore";

// type Props = {}

export default function Main() {
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
  
  const handleStartDrawing = (
    point: Point,
    color: any,
    penStyle: string,
    brushSize: number,
  ) => {
    const ctx = canvasRef.current?.getContext('2d')
      
    
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



  const handleDrawing = (
    currentPoint: Point,
    color: any,
    penStyle: string,
    snapshot: ImageData
  ) => {    
    
    console.log(ctx);
    
    // const ctx = canvasRef.current?.getContext('2d')
    
    if (!ctx || !isDrawing) return;
    if (penStyle === "brush") {
      drawFreeStyle(ctx, currentPoint, color);
    }
    if (penStyle === "eraser") {
      eraser(ctx, currentPoint);
    }
    if (penStyle === "rectangle") {
      console.log(penStyle);
        
      
      snapshot && drawRectangle(ctx, snapshot, currentPoint, previousPoint, isFill);
    }
    if (penStyle === "circle") {
      snapshot &&
        drawCircle(ctx, snapshot, currentPoint, previousPoint, isFill);
    }
    if (penStyle === "triangle") {
      snapshot &&
        drawTriangle(ctx, snapshot, currentPoint, previousPoint, isFill);
    }
    if (penStyle === "line") {
      snapshot && drawLine(ctx, snapshot, currentPoint, previousPoint);
    }
  };
  const handleFinishDrawing = () => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    setIsDrawing(false);
    // Save previous state to restore when resize
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const funcStartDraw = (
    point: Point,
    color: any,
    penStyle: string,
    brushSize: number
  ) => {
    
    socket?.emit("start-drawing", { point, color, penStyle, brushSize });
    handleStartDrawing(point, color, penStyle, brushSize)
  }

  const funcDrawing = (
    currentPoint: Point,
    color: any,
    penStyle: string,
    isDrawing: boolean,
  ) => {
    
    if(isDrawing){
      socket?.emit("drawing", { currentPoint, penStyle, color });
      snapshot && handleDrawing(currentPoint, color, penStyle, snapshot)
    }
  }

  const funcFinishDraw = () => {
    
    socket?.emit("finish-drawing");
    handleFinishDrawing()
  }

  


  useEffect(() => {
    socket?.on("other-start-drawing", ({
      point,
      color,
      penStyle,
      brushSize,
      }) => {    
      handleStartDrawing(point, color, penStyle, brushSize)
    });

    socket?.on("other-drawing", ({currentPoint, color, penStyle})=> {
      
      snapshot && handleDrawing(currentPoint, color, penStyle, snapshot)
    });

    socket?.on("other-finish-drawing", () => {
      handleFinishDrawing()
    });

    return () => {
      socket?.off('other-start-drawing')
      socket?.off('other-drawing')
      socket?.off('other-finish-drawing')
    }


  }, [canvasRef, snapshot, socket])


  return (
    <div className="flex flex-col flex-1 h-full gap-6">
      <div className="relative flex-1 overflow-hidden rounded-md">
        <canvas
          ref={canvasRef}
          id="canvas"
          className="w-full h-full bg-white"
          onMouseDown={(e) =>{
            const point = getPointFromEvent(e)
             funcStartDraw(point, color, penStyle, brushSize)
            }}
          onMouseMove={(e) => {
            const point = getPointFromEvent(e)
            funcDrawing(point, color, penStyle, isDrawing)
          }}
          onMouseUp={funcFinishDraw}
          onMouseLeave={funcFinishDraw}
        ></canvas>
      </div>
      <div className="bg-white rounded-md h-[245px]"><BoxChatAnswer /></div>
    </div>
  );
}
