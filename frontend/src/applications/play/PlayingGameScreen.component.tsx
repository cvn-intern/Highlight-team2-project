import { useRef, useState, useEffect, createContext } from "react";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";
// Variables
import { DEFAULT_BLACK } from "./shared/constants/color";
// Components
import MainLayout from "@/shared/components/MainLayout";
import RankingBoard from "./ranking-board/RankingBoard.component";
import Canvas from "./draw-screen/Canvas.component";
import BoxChatAnswer from "./chat-answer/BoxChatAnswer.component";
import PaintTools from "./draw-screen/PaintTools.component";
// Types
import {
  RGBAColorType,
  PaintContextType,
  Point,
  PenStyleType,
} from "./draw-screen/draw";
// Funtions
import { resetCanvas } from "./draw-screen/draw.helper";
import { rgbaToHex } from "@/shared/lib/colors";
import ActionButtons from "../../shared/components/ActionButtons";
import Logo from "@/shared/components/Logo";
import roomService from "@/shared/services/roomService";
import { useParams } from "react-router-dom";
import { PEN_STYLE_BRUSH } from "./shared/constants/penStyles";
import useToaster from "@/shared/hooks/useToaster";
import IntervalCanvas, { PLAY_GAME } from "@/shared/components/IntervalCanvas";
import { useGameStore } from "@/shared/stores/gameStore";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useUserStore } from "@/shared/stores/userStore";

export const PaintContext = createContext<PaintContextType | null>(null);

export default function PlayingGameScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { codeRoom } = useParams();

  // States
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData>();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [previousPoint, setPreviousPoint] = useState<Point>({ x: 0, y: 0 });
  const [color, setColor] = useState<RGBAColorType>(DEFAULT_BLACK);
  const [penStyle, setPenStyle] = useState<PenStyleType>(PEN_STYLE_BRUSH);
  const [isFill, setIsFill] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(1);
  const [roomInfo, setRoomInfo] = useState<RoomType>();

  const {
    gameStatus,
    setRoomRound,
    setGameStatus,
    roomRound,
    isDrawer,
    setIsDrawer,
  } = useGameStore();
  const { socket } = useSocketStore();
  const { user } = useUserStore();

  // Side Effects
  useDisableBackButton();
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
    setCtx(canvasRef.current.getContext("2d", { willReadFrequently: true }));
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

  useEffect(() => {
    const getRoomInfo = async () => {
      if (!codeRoom) return;
      try {
        const { data } = await roomService.getRoom(codeRoom);
        setRoomInfo(data);
      } catch (error) {
        useToaster({
          type: "error",
          message: "Get room info failed!",
        });
      }
    };
    getRoomInfo();
  }, [codeRoom]);

  useEffect(() => {
    socket?.on("game-play", (data: any) => {
      setGameStatus(PLAY_GAME);
      setRoomRound(data);
      setIsDrawer(data.painter === user?.id);
    });
    return () => {
      socket?.off("game-play");
    };
  }, [socket]);

  const isInterval = gameStatus !== PLAY_GAME;

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
          className={`relative w-[var(--play-window-width)] h-[--play-window-height] flex px-10 py-[56px] gap-6 scale-[0.3] sm:scale-[0.4] md:scale-[0.5] lg:scale-[0.6] xl:scale-[1] 2xl:scale-100 select-none`}
        >
          <div className="absolute top-1 left-20 lg:left-28 2xl:left-24">
            <Logo customClassname="md:w-[180px] 2xl:w-[205px] w-[250px]" />
          </div>
          <RankingBoard />
          <div className="relative w-[var(--canvas-width)] flex flex-col gap-6">
            <ActionButtons roomInfo={roomInfo} />
            {isDrawer && (
              <div className="absolute w-[250px] text-center py-2 bg-slate-500 rounded-xl shadow-lg top-[-25px] z-[999999] text-3xl font-bold left-1/2 translate-x-[-50%] uppercase text-yellow-400 tracking-widest">
                {roomRound?.word}
              </div>
            )}
            <Canvas isDrawer={isDrawer} hidden={isInterval} />
            <IntervalCanvas status={gameStatus} hidden={!isInterval} />
            <BoxChatAnswer />
          </div>
          {isDrawer && <PaintTools />}
        </div>
      </MainLayout>
    </PaintContext.Provider>
  );
}
