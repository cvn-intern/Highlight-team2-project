/* eslint-disable react-hooks/rules-of-hooks */
import useDisableBackButton from '@/shared/hooks/useDisableBackButton';
import { createContext, useEffect, useRef, useState } from 'react';
// Variables
import { DEFAULT_BLACK } from './shared/constants/color';
// Components
import MainLayout from '@/shared/components/MainLayout';
import BoxChatAnswer from './chat-answer/BoxChatAnswer.component';
import Canvas from './draw-screen/Canvas.component';
import PaintTools from './draw-screen/PaintTools.component';
import RankingBoard from './ranking-board/RankingBoard.component';
// Types
import {
  PaintContextType,
  PenStyleType,
  Point,
  RGBAColorType,
} from './draw-screen/draw';
// Funtions
import IntervalCanvas, {
  END_GAME,
  GAME_DRAWER_OUT_CHANNEL,
  GAME_NEW_TURN_CHANNEL,
  GAME_NEXT_DRAWER_IS_OUT,
  GAME_STATUS_CHANNEL,
  INTERVAL_SHOW_WORD,
  PLAY_GAME,
  START_GAME,
  WAIT_FOR_OTHER_PLAYERS
} from '@/shared/components/IntervalCanvas';
import { ProgressPlayTime } from '@/shared/components/ProcessPlayTime';
import useToaster from '@/shared/hooks/useToaster';
import { rgbaToHex } from '@/shared/lib/colors';
import { cn } from '@/shared/lib/utils';
import roomService from '@/shared/services/roomService';
import { useGameStore } from '@/shared/stores/gameStore';
import { useSocketStore } from '@/shared/stores/socketStore';
import { RoomStatusType, RoomType } from '@/shared/types/room';
import { useParams } from 'react-router-dom';
import ActionButtons from '../../shared/components/ActionButtons';
import { resetCanvas } from './draw-screen/draw.helper';
import { NEW_PLAYER } from './shared/constants/drawEvent';
import { PEN_STYLE_BRUSH } from './shared/constants/penStyles';

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
      ctx.lineCap = 'round';
    };
    resetState();
    window.addEventListener('resize', () => {
      resetState();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!canvasRef.current) return;
    setCtx(canvasRef.current.getContext('2d', { willReadFrequently: true }));
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
          type: 'error',
          message: 'Get room info failed!',
        });
      }
    };
    getRoomInfo();
  }, [codeRoom]);
  let timeout: any

  useEffect(() => {
    socket?.on(GAME_NEW_TURN_CHANNEL, (data: RoomRound) => {
      setRoomRound(data);
      setCorrectAnswers([]);
    });

    socket?.on(INTERVAL_SHOW_WORD, () => {
      setIsDrawer(false);
    });

    return () => {
      socket?.off(GAME_NEW_TURN_CHANNEL);
      socket?.off(INTERVAL_SHOW_WORD);
      clearTimeout(timeout)
    };
  }, [socket, isDrawer, roomRound, gameStatus, correctAnswers, isHost]);

  useEffect(() => {
    socket?.on(GAME_STATUS_CHANNEL, ({ success, status }: RoomStatusType) => {
      if (!success) return;
      if (status === PLAY_GAME) socket.emit(NEW_PLAYER, codeRoom);
      setGameStatus(status!);
    });

    socket?.on(GAME_NEXT_DRAWER_IS_OUT, () => {
      useToaster({
        message: 'Next drawer is out. The round restarts!',
        type: 'warning',
        icon: '😅',
        bodyClassName: 'text-sm font-semibold',
      });
    });

    socket?.on(GAME_DRAWER_OUT_CHANNEL, () => {
      useToaster({
        message: 'Drawer is out. The round restarts!',
        type: 'warning',
        icon: '😅',
        bodyClassName: 'text-sm font-semibold',
      });
    });
    socket?.on(END_GAME, (isEndGame: boolean) => {
      if (isEndGame) {
        setGameStatus(END_GAME)
      }
    })

    return () => {
      socket?.off(GAME_STATUS_CHANNEL);
      socket?.off(GAME_NEXT_DRAWER_IS_OUT);
      socket?.off(GAME_DRAWER_OUT_CHANNEL);
      socket?.off(END_GAME);
    };
  }, [socket, participants, isHost, gameStatus]);

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
          className={`relative w-[var(--play-window-width)] h-[--play-window-height] flex items-center justify-center px-10 py-[56px] gap-6 scale-[0.3] sm:scale-[0.4] md:scale-[0.5] lg:scale-[0.6] xl:scale-[1] 2xl:scale-100 select-none`}
        >
          <RankingBoard />
          <div className="relative w-[var(--canvas-width)] flex flex-col gap-6">
            <ActionButtons roomInfo={roomInfo} />
            {isDrawer && gameStatus === PLAY_GAME && (
              <div className="absolute w-[250px] text-center py-2 bg-slate-500 rounded-xl shadow-lg top-[-25px] z-[999999] text-3xl font-bold left-1/2 translate-x-[-50%] uppercase text-yellow-400 tracking-widest">
                {roomRound?.word}
              </div>
            )}
            <Canvas isDrawer={isDrawer} hidden={isInterval} />
            {gameStatus && isInterval && (
              <IntervalCanvas status={gameStatus} hidden={!isInterval} />
            )}
            <BoxChatAnswer />
            <div className={cn("absolute top-[380px] z-[999999] w-full", {
              "hidden": gameStatus === WAIT_FOR_OTHER_PLAYERS || gameStatus === START_GAME
            })}>
              <ProgressPlayTime />
            </div>
          </div>

          {isDrawer && <PaintTools />}
        </div>
      </MainLayout>
    </PaintContext.Provider>
  );
}
