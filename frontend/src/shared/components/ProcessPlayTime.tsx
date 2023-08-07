import { ROUND_DURATION_MILISECONDS } from '@/applications/play/draw-screen/Canvas.component';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import roomService from '../services/roomService';
import { useGameStore } from '../stores/gameStore';
import { useSocketStore } from '../stores/socketStore';
import { GamePresentProgressPackage } from '../types/gameProgress';
import {
  DRAWER_SKIP_TURN_CHANNEL,
  END_GAME,
  GAME_DRAWER_OUT_CHANNEL,
  GAME_NEW_TURN_CHANNEL,
  GAME_PRESENT_PROGRESS,
  GAME_PRESENT_PROGRESS_NEW_PLAYER,
  GAME_REFRESH_DRAWER,
  INTERVAL_DURATION_MILISECONDS,
  INTERVAL_NEW_TURN,
  INTERVAL_SHOW_WORD,
  PLAY_GAME,
  RESET_GAME,
  SKIP_DRAW_TURN,
  START_GAME,
  WAIT_FOR_OTHER_PLAYERS
} from './IntervalCanvas';
import { Progress } from './shadcn-ui/progress';

export const MIN_PROGRESS_PERCENTAGE = 0;
export const MAX_PROGRESS_PERCENTAGE = 100;
export const TIME_PERSTEP = 100;
const ONE_SECOND_IN_MILISECOND = 1000

export function ProgressPlayTime() {
  const [progress, setProgress] = useState(MAX_PROGRESS_PERCENTAGE);
  const [isRunning, setIsRunning] = useState(true);
  const { socket } = useSocketStore();
  const {
    gameStatus,
    isHost,
    setGameStatus,
    participants,
    getIsHost,
    setCorrectAnswers,
    setParticipants,
    roomRound,
  } = useGameStore();
  const { codeRoom } = useParams();
  const progressInterval: any = useRef(null);

  const handleProgressTimeout = (status: string) => {
    const isHost = getIsHost();
    clearInterval(progressInterval)

    if (!isHost || !socket || !codeRoom) return;
    switch (status) {
      case INTERVAL_NEW_TURN:
        socket.emit(PLAY_GAME, codeRoom);
        socket.emit(GAME_PRESENT_PROGRESS, {
          codeRoom,
          maximumTimeInMiliSeconds: ROUND_DURATION_MILISECONDS,
          startProgress: MAX_PROGRESS_PERCENTAGE,
          status: PLAY_GAME,
          sendAt: moment(),
        });
        return;

      case PLAY_GAME:
        socket.emit(INTERVAL_SHOW_WORD, codeRoom);
        socket.emit(GAME_PRESENT_PROGRESS, {
          codeRoom,
          maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
          startProgress: MAX_PROGRESS_PERCENTAGE,
          status: INTERVAL_SHOW_WORD,
          sendAt: moment(),
        });
        return;

      case SKIP_DRAW_TURN:
        socket.emit(GAME_PRESENT_PROGRESS, {
          codeRoom,
          maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
          startProgress: MAX_PROGRESS_PERCENTAGE,
          status: INTERVAL_NEW_TURN,
          sendAt: moment(),
        });
        return;

      case GAME_REFRESH_DRAWER:
      case INTERVAL_SHOW_WORD:
        socket.emit(GAME_NEW_TURN_CHANNEL, codeRoom);
        socket.emit(GAME_PRESENT_PROGRESS, {
          codeRoom,
          maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
          startProgress: MAX_PROGRESS_PERCENTAGE,
          status: INTERVAL_NEW_TURN,
          sendAt: moment(),
        });
        return;
      case END_GAME:
        socket.emit(RESET_GAME, codeRoom);
        return;
    }
  };

  useEffect(() => {
    setProgress(MAX_PROGRESS_PERCENTAGE);
  }, [gameStatus, roomRound]);


  const handleIntervalProgress = async (data: GamePresentProgressPackage) => {
    if (progressInterval) clearInterval(progressInterval.current);
    let { startProgress } = data;
    const { status, maximumTimeInMiliSeconds, sendAt } = data;
    const maximumTimeInSeconds = maximumTimeInMiliSeconds / ONE_SECOND_IN_MILISECOND;
    setGameStatus(status);
    setProgress(startProgress);

    let currentRound = roomRound;
    if (!currentRound && codeRoom) {
      const { data } = await roomService.currentRound(codeRoom);
      currentRound = data;
    }

    let startTime = null;

    switch (status) {
      case PLAY_GAME:
        startTime = currentRound?.started_at;
        break;
      default:
        startTime = sendAt;
        break;
    }

    if (startTime) {
      progressInterval.current = setInterval(
        (startTime: Date) => {
          if (startProgress <= MIN_PROGRESS_PERCENTAGE) {
            clearInterval(progressInterval.current);
            return handleProgressTimeout(status);
          }
          const currentTime = new Date();
          const decreaseTimeOverSecond = (currentTime.getTime() - startTime.getTime()) / ONE_SECOND_IN_MILISECOND;
          startProgress = (maximumTimeInSeconds - decreaseTimeOverSecond) / maximumTimeInSeconds;
          setProgress(startProgress * MAX_PROGRESS_PERCENTAGE);
        },
        TIME_PERSTEP,
        new Date(startTime)
      );
    }
  };


  useEffect(() => {
    socket?.on(
      GAME_PRESENT_PROGRESS,
      async (data: GamePresentProgressPackage) => {
        await handleIntervalProgress(data);
      }
    );

    socket?.on(
      GAME_PRESENT_PROGRESS_NEW_PLAYER,
      async (data: GamePresentProgressPackage) => {
        await handleIntervalProgress(data);
      }
    );

    socket?.on(RESET_GAME, () => {
      setIsRunning(false);
    });

    socket?.on(END_GAME, async () => {
      setCorrectAnswers([]);
      setParticipants(
        [...participants].map((participant) => ({
          ...participant,
          is_painter: false,
          is_next_painter: false,
        }))
      );
      setIsRunning(false);
      await handleIntervalProgress({
        maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
        sendAt: new Date(),
        startProgress: MAX_PROGRESS_PERCENTAGE,
        status: END_GAME,
      });
      setIsRunning(true);
    });

    if (!codeRoom) return;
    socket?.on(codeRoom, ({ socketId }: MessageReceiver) => {
      if (
        !isHost ||
        !socketId ||
        gameStatus === START_GAME ||
        gameStatus === WAIT_FOR_OTHER_PLAYERS
      )
        return;
      socket.emit(GAME_PRESENT_PROGRESS_NEW_PLAYER, {
        socketId,
        codeRoom,
        maximumTimeInMiliSeconds:
          gameStatus === PLAY_GAME
            ? ROUND_DURATION_MILISECONDS
            : INTERVAL_DURATION_MILISECONDS,
        startProgress: progress,
        status: gameStatus,
        sendAt: moment(),
      });
    });

    socket?.on(GAME_DRAWER_OUT_CHANNEL, async () => {
      setIsRunning(false);
      await handleIntervalProgress({
        maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
        sendAt: new Date(),
        startProgress: MAX_PROGRESS_PERCENTAGE,
        status: GAME_REFRESH_DRAWER,
      });
      setIsRunning(true);

    });

    socket?.on(DRAWER_SKIP_TURN_CHANNEL, async () => {
      setIsRunning(false);
      await handleIntervalProgress({
        maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
        sendAt: new Date(),
        startProgress: MAX_PROGRESS_PERCENTAGE,
        status: SKIP_DRAW_TURN,
      });
      setIsRunning(true);
    });

    return () => {
      socket?.off(GAME_PRESENT_PROGRESS);
      socket?.off(GAME_PRESENT_PROGRESS_NEW_PLAYER);
      socket?.off(RESET_GAME);
      socket?.off(END_GAME);
      socket?.off(codeRoom);
    };
  }, [
    socket,
    gameStatus,
    codeRoom,
    progress,
    progressInterval,
    isRunning,
    participants,
    roomRound,
    isHost,
  ]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;

      setIsRunning(true);
    }
  }, [isRunning, participants, gameStatus, roomRound]);

  return (
    <Progress
      value={progress}
      className="absolute bottom-1 w-[98%] h-2.5 left-1/2 -translate-x-1/2 bg-blue-900 border-2 border-black"
    />
  );
}
