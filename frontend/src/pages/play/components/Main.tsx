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

export default function Main() {
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const {
    canvasRef,
    ctx,
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

  // Handlers
  const handleStartDrawing = (
    e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => {
    console.log(e);
    
    if (!ctx) return;
    const canvas = ctx.canvas;
    if (penStyle === "bucket") {
      fillWithColor(ctx, e, color);
      return;
    }
    setIsDrawing(true);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setStartX(x);
    setStartY(y);
    const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
    ctx.fillStyle = hexColor;
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = brushSize;
    // Pick color
    if (penStyle === "picker") {
      // alert("picker");
      pickColor(ctx, x, y, setColor);
      return;
    }
    // Save previous state to prevent drag image
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.beginPath();
    // Make a dot
    (penStyle === "brush" || penStyle === "circle") &&
      drawFreeStyle(ctx, e, color);
    penStyle === "eraser" && eraser(ctx, e);

    
    socket.emit("start-drawing", { startX, startY, color, penStyle, isFill, brushSize });

  };
  const handleDrawing = (
    e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => {
    
    if (!ctx || !isDrawing) return;
    if (penStyle === "brush") {
      drawFreeStyle(ctx, e, color);
    }
    if (penStyle === "eraser") {
      eraser(ctx, e);
    }
    if (penStyle === "rectangle") {
      snapshot && drawRectangle(ctx, snapshot, e, startX, startY, isFill);
    }
    if (penStyle === "circle") {
      snapshot && drawCircle(ctx, snapshot, e, startX, startY, isFill);
    }
    if (penStyle === "triangle") {
      snapshot && drawTriangle(ctx, snapshot, e, startX, startY, isFill);
    }
    if (penStyle === "line") {
      snapshot && drawLine(ctx, snapshot, e, startX, startY);
    }

    socket.emit("drawing", { startX, startY, penStyle, color });

  };
  const handleFinishDrawing = () => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    setIsDrawing(false);
    // Save previous state to restore when resize
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    socket.emit("finish-drawing");
  };


  useEffect(() => {
    socket.on("other-start-drawing", (data) => {
      // Xử lý logic vẽ từ các người dùng khác
      
      handleStartDrawing(data)
      // Cập nhật giao diện vẽ
    });

    // Lắng nghe sự kiện other-drawing từ server và cập nhật giao diện vẽ
    socket.on("other-drawing", (data) => {
      // Xử lý logic vẽ từ các người dùng khác
      handleDrawing(data)
      // Cập nhật giao diện vẽ
    });

    // Lắng nghe sự kiện other-finish-drawing từ server và cập nhật giao diện vẽ
    socket.on("other-finish-drawing", () => {
      // Xử lý logic vẽ từ các người dùng khác
      handleFinishDrawing()
      // Cập nhật giao diện vẽ
    });

    return () => {
      socket.off('other-start-drawing')
      socket.off('other-drawing')
      socket.off('other-finish-drawing')
    }


  }, [])

  return (
    <div className="flex flex-col flex-1 h-full gap-6">
      <div className="relative flex-1 overflow-hidden rounded-md">
        <canvas
          ref={canvasRef}
          id="canvas"
          className="w-full h-full bg-white"
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDrawing}
          onMouseUp={handleFinishDrawing}
          onMouseLeave={handleFinishDrawing}
        ></canvas>
      </div>
      <div className="bg-white rounded-md h-[245px]">Chat and answers</div>
    </div>
  );
}
