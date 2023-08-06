/* eslint-disable react-hooks/rules-of-hooks */
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";
import { createContext, useEffect, useRef, useState } from "react";
// Variables
import { DEFAULT_BLACK } from "./shared/constants/color";
// Components
import MainLayout from "@/shared/components/MainLayout";
import BoxChatAnswer from "./chat-answer/BoxChatAnswer.component";
import Canvas from "./draw-screen/Canvas.component";
import PaintTools from "./draw-screen/PaintTools.component";
import RankingBoard from "./ranking-board/RankingBoard.component";
// Types
import {
  PaintContextType,
  PenStyleType,
  Point,
  RGBAColorType,
  SocketGetCanvasState,
} from "./draw-screen/draw";
// Funtions
import IntervalCanvas, {
  DRAWER_SKIP_TURN_CHANNEL,
  GAME_DRAWER_OUT_CHANNEL,
  GAME_NEW_TURN_CHANNEL,
  GAME_STATUS_CHANNEL,
  GET_CORRECT_PLAYERS,
  HINT_WORD,
  INTERVAL_SHOW_WORD,
  PLAY_GAME,
  SEND_HINT_WORD,
  SKIP_DRAW_TURN,
  START_GAME,
  UPDATE_ROOM_ROUND_CHANNEL,
  WAIT_FOR_OTHER_PLAYERS,
} from "@/shared/components/IntervalCanvas";
import { ProgressPlayTime } from "@/shared/components/ProcessPlayTime";
import useToaster from "@/shared/hooks/useToaster";
import { rgbaToHex } from "@/shared/lib/colors";
import { cn } from "@/shared/lib/utils";
import roomService from "@/shared/services/roomService";
import { useGameStore } from "@/shared/stores/gameStore";
import { useSocketStore } from "@/shared/stores/socketStore";
import { RoomStatusType, RoomType } from "@/shared/types/room";
import { useParams } from "react-router-dom";
import ActionButtons from "../../shared/components/ActionButtons";
import { resetCanvas } from "./draw-screen/draw.helper";
import { PEN_STYLE_BRUSH } from "./shared/constants/penStyles";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { CANVAS_STATE, GET_CANVAS_STATE } from "./shared/constants/drawEvent";

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
  const [numberOfHint, setNumberOfHint] = useState<number>(0);
  const [isDisableHintButton, setIsDisableHintButton] =
    useState<boolean>(false);
  const [hintWord, setHintWord] = useState<string | null>(null);
  const [maxNumberOfHint, setMaxNumberOfHint] = useState<number>(0);

  const {
    participants,
    gameStatus,
    setRoomRound,
    setGameStatus,
    roomRound,
    isDrawer,
    isHost,
    setIsDrawer,
    correctAnswers,
    setCorrectAnswers,
  } = useGameStore();
  const { socket } = useSocketStore();

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
  let timeout: any;

  useEffect(() => {
    socket?.on(GAME_NEW_TURN_CHANNEL, (data: RoomRound) => {
      setRoomRound(data);
      setCorrectAnswers([]);
      setHintWord(null);
      if (!canvasRef || !canvasRef.current) return;
      resetCanvas(
        canvasRef.current.getContext("2d", { willReadFrequently: true })!
      );
    });

    socket?.on(INTERVAL_SHOW_WORD, (round: RoomRound) => {
      setIsDrawer(false);
      setRoomRound(round);
    });

    return () => {
      socket?.off(GAME_NEW_TURN_CHANNEL);
      socket?.off(INTERVAL_SHOW_WORD);
      clearTimeout(timeout);
    };
  }, [
    socket,
    isDrawer,
    roomRound,
    gameStatus,
    correctAnswers,
    isHost,
    canvasRef,
  ]);

  useEffect(() => {
    socket?.on(GAME_STATUS_CHANNEL, ({ success, status }: RoomStatusType) => {
      if (!success) return;
      if (
        isHost &&
        status === WAIT_FOR_OTHER_PLAYERS &&
        participants.length > 1
      ) {
        setGameStatus(START_GAME);
        return;
      }
      setGameStatus(status!);
    });

    socket?.on(GAME_DRAWER_OUT_CHANNEL, () => {
      useToaster({
        message: "Drawer is out. The round restarts!",
        type: "warning",
        icon: "😅",
        bodyClassName: "text-sm font-semibold",
      });
    });

    socket?.on(UPDATE_ROOM_ROUND_CHANNEL, (roomRound: RoomRound) => {
      setRoomRound(roomRound);
    });

    socket?.on(HINT_WORD, (word: string) => {
      setHintWord(word);
    });

    socket?.on(GET_CANVAS_STATE, (id: string) => {
      if (!isDrawer) return;
      if (hintWord) {
        socket?.emit(SEND_HINT_WORD, { hintWord, id });
      }
      socket?.emit(GET_CORRECT_PLAYERS, { correctAnswers, id });
      if (!canvasRef || !canvasRef.current) return;
      const dataImg = canvasRef.current.toDataURL();
      socket?.emit(CANVAS_STATE, { dataImg, id } as SocketGetCanvasState);
    });

    socket?.on(DRAWER_SKIP_TURN_CHANNEL, () => {
      useToaster({
        type: "warning",
        message: "Drawer has skipped the turn. The round restarts!",
      });
    });

    socket?.on(GET_CORRECT_PLAYERS, (data: number[]) => {
      if (!data) return;
      setCorrectAnswers(data);
    });

    return () => {
      socket?.off(GAME_STATUS_CHANNEL);
      socket?.off(GAME_DRAWER_OUT_CHANNEL);
      socket?.off(HINT_WORD);
      socket?.off(UPDATE_ROOM_ROUND_CHANNEL);
      socket?.off(DRAWER_SKIP_TURN_CHANNEL);
      socket?.off(GET_CORRECT_PLAYERS);
      socket?.off(GET_CANVAS_STATE);
    };
  }, [
    socket,
    participants,
    isHost,
    gameStatus,
    hintWord,
    canvasRef,
    correctAnswers,
  ]);

  const isInterval = gameStatus !== PLAY_GAME;

  const handleShowHint = () => {
    if (hintWord === roomRound?.word) return;

    if (numberOfHint === maxNumberOfHint) {
      setIsDisableHintButton(true);
      return;
    }

    setNumberOfHint(numberOfHint + 1);
    socket?.emit(HINT_WORD, {
      codeRoom,
      word: hintWord,
    });
  };

  useEffect(() => {
    if (roomRound) {
      setMaxNumberOfHint(calculateMaxNumberOfHint(roomRound?.word));
    }
  }, [roomRound]);

  const calculateMaxNumberOfHint = (word: string): number => {
    const maxTimes: number = word.length / 3;
    return Number.parseInt(maxTimes.toString()) + 1;
  };

  const handleSkipDrawTurn = () => {
    if (!isDrawer) return;
    socket?.emit(SKIP_DRAW_TURN, { codeRoom, painterId: roomRound?.painter });
  };

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
          className={`relative w-[var(--play-window-width)] h-[--play-window-height] flex items-center justify-center px-10 py-[56px] gap-6 scale-[0.3] sm:scale-[0.4] md:scale-[0.5] lg:scale-[0.6] xl:scale-[1] 2xl:scale-100 select-none`}
        >
          <RankingBoard />
          <div className="relative w-[var(--canvas-width)] flex flex-col gap-6">
            <ActionButtons roomInfo={roomInfo} />
            {isDrawer && gameStatus === PLAY_GAME && (
              <div className="flex items-center gap-4 absolute min-w-[250px] text-center py-2 px-3 bg-slate-500 rounded-xl shadow-lg top-[-25px] z-[999999] text-3xl font-bold left-1/2 translate-x-[-50%] uppercase text-yellow-400 tracking-widest">
                <Button
                  disabled={isDisableHintButton}
                  className="bg-transparent border-2 border-white shadow-xl rounded-xl"
                  onClick={handleShowHint}
                >
                  HINT
                </Button>
                <span>{roomRound?.word}</span>
                <Button
                  className="bg-transparent border-2 border-white shadow-xl rounded-xl"
                  onClick={handleSkipDrawTurn}
                >
                  SKIP
                </Button>
              </div>
            )}
            {!isDrawer && gameStatus === PLAY_GAME && hintWord && (
              <div className="absolute text-center py-2 px-4 flex justify-center w-max gap-2 bg-slate-500 rounded-xl shadow-lg top-[-25px] z-[999999] text-3xl font-bold left-1/2 translate-x-[-50%] uppercase text-yellow-400 tracking-widest">
                {hintWord.split("").map((char: string, index: number) => (
                  <span key={index}>{char}</span>
                ))}
              </div>
            )}
            <Canvas isDrawer={isDrawer} hidden={isInterval} />
            {gameStatus && isInterval && (
              <IntervalCanvas status={gameStatus} hidden={!isInterval} />
            )}
            <BoxChatAnswer />
            <div
              className={cn("absolute top-[380px] z-[999999] w-full", {
                hidden:
                  gameStatus === WAIT_FOR_OTHER_PLAYERS ||
                  gameStatus === START_GAME,
              })}
            >
              <ProgressPlayTime />
            </div>
          </div>

          {isDrawer && <PaintTools />}
        </div>
      </MainLayout>
    </PaintContext.Provider>
  );
}
