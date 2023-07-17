import { useRef, useState, useEffect, createContext } from "react";
// Variables
import { DEFAULT_BLACK } from "./constants/color";
// Components
import MainLayout from "@/shared/components/MainLayout";
import RankingBoard from "./components/ranking-board/RankingBoard";
import Canvas from "./components/Canvas";
import BoxChatAnswer from "./components/BoxChatAnswer";
import PaintTools from "./components/PaintTools";
// Types
import { RGBAColorType, PaintContextType, Point } from "./config/types";
// Funtions
import { resetCanvas } from "./helpers";
import { rgbaToHex } from "@/shared/lib/colors";

// type Props = {};
export const PaintContext = createContext<PaintContextType | null>(null);

export default function PlayingGameScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // States
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData>();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [previousPoint, setPreviousPoint] = useState<Point>({ x: 0, y: 0 });
  const [color, setColor] = useState<RGBAColorType>(DEFAULT_BLACK);
  const [penStyle, setPenStyle] = useState<string>("brush");
  const [isFill, setIsFill] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(1);
  // Side Effects
  useEffect(() => {
    const resetState = () => {
      if (!ctx) return;
      const canvas = ctx.canvas;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      resetCanvas(ctx);
      // Restore previous states
      snapshot && ctx.putImageData(snapshot, 0, 0);
      const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
      ctx.fillStyle = hexColor;
      ctx.strokeStyle = hexColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
    };
    resetState();
    window.addEventListener("resize", () => {
      resetState();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!canvasRef.current) return;
    setCtx(canvasRef.current.getContext("2d"));
  }, [canvasRef]);

  useEffect(() => {
    if (!ctx) {
      return;
    }
    const canvas = ctx.canvas;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resetCanvas(ctx);
  }, [ctx]);
  return (
    <PaintContext.Provider
      value={{
        canvasRef,
        ctx,
        snapshot,
        isDrawing,
        previousPoint,
        color,
        penStyle,
        isFill,
        brushSize,
        setCtx,
        setSnapshot,
        setIsDrawing,
        setPreviousPoint,
        setColor,
        setPenStyle,
        setIsFill,
        setBrushSize,
      }}
    >
      <MainLayout>
        <div
          className={`w-[var(--play-window-width)] h-[--play-window-height] flex px-10 py-[56px] gap-6 scale-[0.3] sm:scale-[0.4] md:scale-[0.5] lg:scale-[0.6] xl:scale-[0.8] 2xl:scale-100 select-none`}
        >
          <RankingBoard />
          <div className="w-[var(--canvas-width)] flex flex-col gap-6">
            <Canvas />
            <BoxChatAnswer />
          </div>
          <PaintTools />
        </div>
      </MainLayout>
    </PaintContext.Provider>
  );
}
