/* eslint-disable react-hooks/rules-of-hooks */
import useDisableBackButton from '@/shared/hooks/useDisableBackButton';
import { createContext, useEffect, useRef, useState } from 'react';
// Variables
import { DEFAULT_BLACK } from './shared/constants/color';
// Components
import MainLayout from '@/shared/components/MainLayout';
import BoxChatAnswer from './chat-answer/BoxChatAnswer.component';
import Canvas, {
  ROUND_DURATION_MILISECONDS,
} from './draw-screen/Canvas.component';
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
  GAME_DRAWER_OUT_CHANNEL,
  GAME_NEW_TURN_CHANNEL,
  GAME_PROGRESS,
  GAME_REFRESH_ROUND,
  GAME_STATUS_CHANNEL,
  INTERVAL_DURATION_MILISECONDS,
  INTERVAL_NEW_TURN,
  INTERVAL_SHOW_WORD,
  PLAY_GAME,
  START_GAME,
  WAIT_FOR_OTHER_PLAYERS,
} from '@/shared/components/IntervalCanvas';
import { ProgressPlayTime } from '@/shared/components/ProcessPlayTime';
import useToaster from '@/shared/hooks/useToaster';
import { rgbaToHex } from '@/shared/lib/colors';
import roomService from '@/shared/services/roomService';
import { useGameStore } from '@/shared/stores/gameStore';
import { useSocketStore } from '@/shared/stores/socketStore';
import { useUserStore } from '@/shared/stores/userStore';
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

  useEffect(() => {
    socket?.on(GAME_NEW_TURN_CHANNEL, (data: RoomRound) => {
      setGameStatus(INTERVAL_NEW_TURN);
      setRoomRound(data);
      setIsDrawer(data.painter === user?.id);
      setCorrectAnswers([]);
    });

    socket?.on(PLAY_GAME, () => {
      setGameStatus(PLAY_GAME);
    });

    socket?.on(INTERVAL_SHOW_WORD, () => {
      setGameStatus(INTERVAL_SHOW_WORD);
      setIsDrawer(false);
    });

    let timeout: any
    socket?.on(GAME_REFRESH_ROUND, () => {
      clearTimeout(timeout)
      if(!isHost) return
      timeout = setTimeout(() => {
        socket?.emit(GAME_PROGRESS, {
          codeRoom,
          maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
        });
      },  500)
     
    })


    return () => {
      socket?.off(GAME_NEW_TURN_CHANNEL);
      socket?.off(PLAY_GAME);
      socket?.off(INTERVAL_SHOW_WORD);
      socket?.off(GAME_REFRESH_ROUND)
      clearTimeout(timeout)
    };
  }, [socket, isDrawer, roomRound, gameStatus, correctAnswers, isHost]);

  useEffect(() => {
    socket?.on(GAME_STATUS_CHANNEL, ({ success, status }: RoomStatusType) => {
      if (!success) return;
      if (status === PLAY_GAME) socket.emit(NEW_PLAYER, codeRoom);
      setGameStatus(status!);
    });

    socket?.on(GAME_DRAWER_OUT_CHANNEL, () => {
      useToaster({
        message: 'Drawer is out. The round restarts!',
        type: 'warning',
        icon: '😅',
        bodyClassName: 'text-sm font-semibold',
      });
    });


    return () => {
      socket?.off(GAME_STATUS_CHANNEL);
      socket?.off(GAME_DRAWER_OUT_CHANNEL);
    };
  }, [socket, participants]);


  const isInterval = gameStatus !== PLAY_GAME;

  const handleProgressTimeout = () => {
    if (!isHost || !socket || !codeRoom) return;
    if (gameStatus === PLAY_GAME) {
      socket?.emit(INTERVAL_SHOW_WORD, codeRoom);
      socket?.emit(GAME_PROGRESS, {
        codeRoom,
        maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
      });
      return;
    }

    
    if (gameStatus === INTERVAL_NEW_TURN) {
      
      socket.emit(PLAY_GAME, codeRoom);
      socket.emit(GAME_PROGRESS, {
        codeRoom,
        maximumTimeInMiliSeconds: ROUND_DURATION_MILISECONDS,
      });
      return;
    }
    if (gameStatus === INTERVAL_SHOW_WORD) {
      socket.emit(GAME_NEW_TURN_CHANNEL, codeRoom);
      socket.emit(GAME_PROGRESS, {
        codeRoom,
        maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
      });
      return;
    }
  }

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
            {gameStatus !== WAIT_FOR_OTHER_PLAYERS && gameStatus !== START_GAME && (
              <div className="absolute top-[380px] z-[999999] w-full">
                <ProgressPlayTime
                  hanldeWhenTimeOut={handleProgressTimeout}
                  maximumTimeInMiliSeconds={INTERVAL_DURATION_MILISECONDS}
                />
              </div>
            )}
          </div>

          {isDrawer && <PaintTools />}
        </div>
      </MainLayout>
    </PaintContext.Provider>
  );
}
