import { MouseEvent, useContext, useEffect } from "react";
import { PaintContext } from "@/applications/play";
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
} from "@/applications/play/helpers";
// Types
import { rgbaToHex } from "@/shared/lib/colors";
import { Drawing, Point, StartDraw } from "../config/types";
import { useSocketStore } from "@/shared/stores/socketStore";

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
  
  const handleStartDrawing = ({point, color, penStyle, brushSize}: StartDraw)  => {
      
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

  const funcStartDraw = ({point, color, penStyle, brushSize}: StartDraw) => {
    socket?.emit("start-drawing", { point, color, penStyle, brushSize });
    handleStartDrawing({point, color, penStyle, brushSize})
  }

  const funcDrawing = ({currentPoint ,color ,penStyle , snapshot, isFill}: Drawing) => {
    
    if(isDrawing){
      socket?.emit("drawing", { currentPoint, penStyle, color, isFill });
      snapshot && handleDrawing({currentPoint, color, penStyle, snapshot, isFill})
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
      handleStartDrawing({point, color, penStyle, brushSize})
    });

    socket?.on("other-drawing", ({currentPoint, color, penStyle, isFill})=> {
      
      snapshot && handleDrawing({currentPoint, color, penStyle, snapshot, isFill})
    });

    socket?.on("other-finish-drawing", () => {
      handleFinishDrawing()
    });

    socket?.on('drawed-state-from-server', (drawed: string) => {
      const img = new Image
      console.log(drawed);
      
      img.src = drawed
      img.onload = () => {
        console.log(123);
        
        ctx?.drawImage(img, 0, 0)
      }
    })

    return () => {
      socket?.off('other-start-drawing')
      socket?.off('other-drawing')
      socket?.off('other-finish-drawing')
    }
  }, [canvasRef, snapshot])



  return (
    <div className="flex flex-col flex-1 h-full gap-6">
      <div className="relative flex-1 overflow-hidden rounded-md">
        <canvas
          ref={canvasRef}
          id="canvas"
          className="w-full h-full bg-white"
          onMouseDown={(e) =>{
            const point = getPointFromEvent(e)
             funcStartDraw({point, color, penStyle, brushSize})
            }}
          onMouseMove={(e) => {
            const currentPoint = getPointFromEvent(e)
            funcDrawing({currentPoint, color, penStyle, snapshot, isFill})
          }}
          onMouseUp={funcFinishDraw}
          onMouseLeave={funcFinishDraw}
        ></canvas>
      </div>
    </div>
  );
}
