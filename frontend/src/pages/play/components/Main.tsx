import { MouseEvent, useContext, useEffect } from "react";
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

// type Props = {}



const socket = io("http://localhost:3000");

export default function Main(props: any) {
  // console.log(props.ctx);
  
  
  const variables = useContext(PaintContext);

  if (!variables) return null;
  const {
    canvasRef,
    ctx,
    setCtx,
    snapshot,
    isDrawing,
    startX,
    startY,
    color,
    penStyle,
    isFill,
    brushSize,
    setSnapshot,
    setIsDrawing,
    setStartX,
    setStartY,
    setColor,
  } = variables;

  console.log(snapshot);
  

  // Handlers
  // let ctx = canvasRef
  // console.log(canvasRef.current.getContext('2d'));
  
  const handleStartDrawing = (
    ctx: any,
    startX: number,
    startY: number,
    color: any,
    penStyle: string,
    brushSize: number
  ) => {
    ctx = canvasRef.current?.getContext('2d')

    console.log(ctx);
    
    color = color
    console.log(color);
    
    if (!ctx) return;
    console.log(ctx);
    
    const canvas = ctx.canvas;
    if (penStyle === "bucket") {
      fillWithColor(ctx, startX, startY, color);
      return;
    }
    
    setIsDrawing(true);
    // const x = e.nativeEvent.offsetX;
    // const y = e.nativeEvent.offsetY;
    setStartX(startX);
    setStartY(startY);
    const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
    ctx.fillStyle = hexColor;
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = brushSize;
    // Pick color
    if (penStyle === "picker") {
      // alert("picker");
      pickColor(ctx, startX, startY, setColor);
      return;
    }
    // Save previous state to prevent drag image
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.beginPath();
    // Make a dot
    (penStyle === "brush" || penStyle === "circle") &&
      drawFreeStyle(ctx, startX, startY, color);
    penStyle === "eraser" && eraser(ctx, startX, startY);

  };

  const funcStartDraw = (
    ctx: any,
    startX: number,
    startY: number,
    color: any,
    penStyle: string,
    brushSize: number
  ) => {
    
    socket.emit("start-drawing", { startX, startY, color, penStyle, brushSize, ctx: ctx });
    handleStartDrawing(ctx, startX, startY, color, penStyle, brushSize)
  }


  const handleDrawing = (
    ctx: any,
    currentX: number,
    currentY: number,
    color: any,
    penStyle: string,
    isDrawing: boolean,
    snapshot: any
  ) => {    
    

    ctx = canvasRef.current?.getContext('2d')
    console.log(ctx);
    
    if (!ctx || !isDrawing) return;
    if (penStyle === "brush") {
      console.log(987);
      console.log(currentX, currentY, color, penStyle);
      
      drawFreeStyle(ctx, currentX, currentY, color);
    }
    if (penStyle === "eraser") {
      eraser(ctx, currentX, currentY);
    }
    if (penStyle === "rectangle") {
      console.log(snapshot);
      
      snapshot && drawRectangle(ctx, snapshot, currentX, currentY, startX, startY, isFill);
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

  const funcDrawing = (
    ctx: any,
    currentX: number,
    currentY: number,
    color: any,
    penStyle: string,
    isDrawing: boolean,
    snapshot: any,
  ) => {
    if(isDrawing){
      socket.emit("drawing", { currentX, currentY, penStyle, color, ctx, isDrawing, snapshot });
      handleDrawing(ctx, currentX, currentY, color, penStyle, isDrawing, snapshot)
    }
  }

  const handleFinishDrawing = () => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    setIsDrawing(false);
    // Save previous state to restore when resize
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    socket.emit("finish-drawing");
  };


  useEffect(() => {
    socket.on("other-start-drawing", ({startX,
      startY,
      color,
      penStyle,
      brushSize,
      ctx}) => {
        console.log(color);
        
      handleStartDrawing(ctx, startX, startY, color, penStyle, brushSize)
    });

    socket.on("other-drawing", ({currentX, currentY, color,penStyle, ctx, isDrawing, snapshot}) => {
      console.log(snapshot);
      
      handleDrawing(ctx, currentX, currentY, color, penStyle, isDrawing, snapshot)
    });

    socket.on("other-finish-drawing", () => {
    });

    return () => {
      socket.off('other-start-drawing')
      socket.off('other-drawing')
      socket.off('other-finish-drawing')
    }


  }, [canvasRef])

  return (
    <div className="flex flex-col flex-1 h-full gap-6">
      <div className="relative flex-1 overflow-hidden rounded-md">
        <canvas
          ref={canvasRef}
          id="canvas"
          className="w-full h-full bg-white"
          onMouseDown={(e) => funcStartDraw(ctx, e.nativeEvent.offsetX, e.nativeEvent.offsetY, color, penStyle, brushSize)}
          onMouseMove={(e) => funcDrawing(ctx, e.nativeEvent.offsetX, e.nativeEvent.offsetY, color, penStyle, isDrawing, snapshot)}
          onMouseUp={handleFinishDrawing}
          onMouseLeave={handleFinishDrawing}
        ></canvas>
      </div>
      <div className="bg-white rounded-md h-[245px]">Chat and answers</div>
    </div>
  );
}
