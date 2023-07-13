import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
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

// type Props = {}



const socket = io("http://localhost:3000");

export default function Main() {

  
  const variables = useContext(PaintContext);
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
    snapshotRef,
    setSnapshot,
    setIsDrawing,
    setPreviousPoint,
    setColor,
  } = variables;
  
  // const snapshotRef = useRef()
  snapshotRef.current = snapshot
  console.log(snapshotRef);
  console.log(snapshot);
  

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
    isDrawing: boolean,
    snapshot: ImageData
  ) => {    
    
    
    const ctx = canvasRef.current?.getContext('2d')
    
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
    // if (penStyle === "circle") {
    //   snapshot && drawCircle(ctx, snapshot, e, startX, startY, isFill);
    // }
    // if (penStyle === "triangle") {
    //   snapshot && drawTriangle(ctx, snapshot, e, startX, startY, isFill);
    // }
    // if (penStyle === "line") {
    //   snapshot && drawLine(ctx, snapshot, e, startX, startY);
    // }
  };

  const handleFinishDrawing = () => {
    const ctx = canvasRef.current?.getContext('2d')
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
    
    socket.emit("start-drawing", { point, color, penStyle, brushSize });
    handleStartDrawing(point, color, penStyle, brushSize)
  }

  const funcDrawing = (
    currentPoint: Point,
    color: any,
    penStyle: string,
    isDrawing: boolean,
    snapshotRef: ImageData
  ) => {
    
    if(isDrawing){
      socket.emit("drawing", { currentPoint, penStyle, color, isDrawing });
      handleDrawing(currentPoint, color, penStyle, isDrawing, snapshotRef)
    }
  }

  const funcFinishDraw = () => {
    
    socket.emit("finish-drawing");
    handleFinishDrawing()
  }

  


  useEffect(() => {
    socket.on("other-start-drawing", ({
      point,
      color,
      penStyle,
      brushSize,
      }) => {    
      handleStartDrawing(point, color, penStyle, brushSize)
    });

    socket.on("other-drawing", ({currentPoint, color, penStyle, isDrawing}) => {
      console.log("🚀 ~ file: Main.tsx:213 ~ useEffect ~ variables:", variables)
      
      snapshot && handleDrawing(currentPoint, color, penStyle, isDrawing, snapshot)
    });

    socket.on("other-finish-drawing", () => {
      handleFinishDrawing()
    });

    return () => {
      socket.off('other-start-drawing')
      socket.off('other-drawing')
      socket.off('other-finish-drawing')
    }


  }, [canvasRef, snapshot])

  // useEffect(() => {
  //   console.log("🚀 ~ file: Main.tsx:213 ~ useEffect ~ variables:", snapshot)
    
  // }, [snapshot])
  

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
            funcDrawing(point, color, penStyle, isDrawing, snapshotRef.current)
          }}
          onMouseUp={funcFinishDraw}
          onMouseLeave={funcFinishDraw}
        ></canvas>
      </div>
      <div className="bg-white rounded-md h-[245px]">Chat and answers</div>
    </div>
  );
}
