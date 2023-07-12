import { useRef, useState, useEffect, createContext } from "react";
// Variables
import { DEFAULT_BLACK } from "./constants/color";
// Components
import MainLayout from "@/common/layout/MainLayout";
// Types
import { RGBAColorType, PaintContextType } from "./config/types";
import { resetCanvas } from "./helpers";
import RankingBoard from "./components/RankingBoard";
import Main from "./components/Main";
import PaintTools from "./components/PaintTools";
// Funtions

// type Props = {};
export const PaintContext = createContext<PaintContextType | null>(null);

export default function PlayingGameScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // States
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData>();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [color, setColor] = useState<RGBAColorType>(DEFAULT_BLACK);
  const [penStyle, setPenStyle] = useState<string>("brush");
  const [isFill, setIsFill] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(1);
  // Side Effects
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (!ctx) return;
      const canvas = ctx.canvas;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      resetCanvas(ctx);
      // Restore previous state
      snapshot && ctx.putImageData(snapshot, 0, 0);
    });
  }, [ctx, snapshot]);
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
        startX,
        startY,
        color,
        penStyle,
        isFill,
        brushSize,
        setCtx,
        setSnapshot,
        setIsDrawing,
        setStartX,
        setStartY,
        setColor,
        setPenStyle,
        setIsFill,
        setBrushSize,
      }}
    >
      <MainLayout>
        <div className="h-full flex px-10 py-[56px] gap-6">
          <RankingBoard />
          <Main />
          <PaintTools />
        </div>
      </MainLayout>
    </PaintContext.Provider>
  );
}
