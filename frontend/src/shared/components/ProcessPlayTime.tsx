import { useState, useEffect, useRef } from 'react';
import { Progress } from './shadcn-ui/progress';
import { useGameStore } from '../stores/gameStore';
import { useSocketStore } from '../stores/socketStore';
import { END_GAME, GAME_DRAWER_OUT_CHANNEL, GAME_NEW_TURN_CHANNEL, GAME_PRESENT_PROGRESS, GAME_PRESENT_PROGRESS_NEW_PLAYER, GAME_REFRESH_DRAWER, INTERVAL_DURATION_MILISECONDS, INTERVAL_NEW_TURN, INTERVAL_SHOW_WORD, PLAY_GAME, RESET_GAME, START_GAME, WAIT_FOR_OTHER_PLAYERS } from './IntervalCanvas';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { ROUND_DURATION_MILISECONDS } from '@/applications/play/draw-screen/Canvas.component';
import { GamePresentProgressPackage } from '../types/gameProgress';
import roomService from '../services/roomService';

export const MIN_PROGRESS_PERCENTAGE = 0;
export const MAX_PROGRESS_PERCENTAGE = 100;
export const TIME_PERSTEP = 100;

export function ProgressPlayTime() {
  const [progress, setProgress] = useState(100);
  const [isRunning, setIsRunning] = useState(true)

  const { socket } = useSocketStore();
  const { gameStatus, isHost, setGameStatus, participants, getIsHost, setCorrectAnswers, setParticipants, roomRound, setRoomRound } = useGameStore();
  const { codeRoom } = useParams()

  const handleProgressTimeout = (status: string) => {
    const isHost = getIsHost()

    if (!isHost || !socket || !codeRoom) return;
    switch (status) {
      case INTERVAL_NEW_TURN:
        socket.emit(PLAY_GAME, codeRoom);
        socket.emit(GAME_PRESENT_PROGRESS, { codeRoom, maximumTimeInMiliSeconds: ROUND_DURATION_MILISECONDS, startProgress: 100, status: PLAY_GAME, sendAt: moment() })
        return

      case PLAY_GAME:
        socket.emit(INTERVAL_SHOW_WORD, codeRoom);
        socket.emit(GAME_PRESENT_PROGRESS, { codeRoom, maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS, startProgress: 100, status: INTERVAL_SHOW_WORD, sendAt: moment() })
        return

      case GAME_REFRESH_DRAWER:
      case INTERVAL_SHOW_WORD:
        socket.emit(GAME_NEW_TURN_CHANNEL, codeRoom);
        socket.emit(GAME_PRESENT_PROGRESS, { codeRoom, maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS, startProgress: 100, status: INTERVAL_NEW_TURN, sendAt: moment() })
        return

      case END_GAME:
        socket.emit(RESET_GAME, codeRoom);
        return
    }
  }

  useEffect(() => {
    if (gameStatus !== 'game-start') setProgress(100);
  }, [gameStatus, roomRound]);

  const progressInterval: any = useRef(null);

  const handleIntervalProgress = async (data: GamePresentProgressPackage) => {
    if (progressInterval) clearInterval(progressInterval.current)
    let { startProgress } = data
    const { status, maximumTimeInMiliSeconds } = data
    const maximumTimeInSeconds = maximumTimeInMiliSeconds/1000;
    setGameStatus(status)
    setProgress(startProgress)

    let currentRound = roomRound;
    if (!currentRound && codeRoom) {
      const { data } = await roomService.currentRound(codeRoom);
      setRoomRound(data);
      currentRound = data;
    }

    let startTime = null;
    
    switch (status) {
      case 'game-start':
      case 'new-turn':
        startTime = currentRound?.started_at;
        break;
      default:
        startTime = new Date();
        break;
    }

    if (startTime) {
      progressInterval.current = setInterval((startTime: Date) => {
        if (startProgress <= MIN_PROGRESS_PERCENTAGE) {
          clearInterval(progressInterval.current);
          return handleProgressTimeout(status);
        }
        const curTime = new Date();
        const test = (curTime.getTime() - startTime.getTime()) / 1000;
        startProgress = (maximumTimeInSeconds - test) / maximumTimeInSeconds;
        setProgress(startProgress * 100)
      }, TIME_PERSTEP, new Date(startTime))
    }
  }

  useEffect(() => {
    socket?.on(GAME_PRESENT_PROGRESS, async (data: GamePresentProgressPackage) => {
      await handleIntervalProgress(data)
    });

    socket?.on(GAME_PRESENT_PROGRESS_NEW_PLAYER, async (data: GamePresentProgressPackage) => {
      await handleIntervalProgress(data)
    });

    socket?.on(RESET_GAME, () => {
      setIsRunning(false)
    })

    socket?.on(END_GAME, async () => {
      setCorrectAnswers([])
      setParticipants([...participants].map(participant => ({ ...participant, is_painter: false, is_next_painter: false })))
      setIsRunning(false)
      await handleIntervalProgress({ maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS, sendAt: new Date(), startProgress: 100, status: END_GAME })
      setIsRunning(true)
    })

    if (!codeRoom) return
    socket?.on(codeRoom, ({ socketId }: MessageReceiver) => {
      if (!isHost || !socketId || gameStatus === START_GAME || gameStatus === WAIT_FOR_OTHER_PLAYERS) return
      socket.emit(GAME_PRESENT_PROGRESS_NEW_PLAYER,
        { socketId, codeRoom, maximumTimeInMiliSeconds: gameStatus === PLAY_GAME ? ROUND_DURATION_MILISECONDS : INTERVAL_DURATION_MILISECONDS, startProgress: progress, status: gameStatus, sendAt: moment() })
    });

    socket?.on(GAME_DRAWER_OUT_CHANNEL, async () => {
      setIsRunning(false)
      await handleIntervalProgress({ maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS, sendAt: new Date(), startProgress: 100, status: "refresh-drawer" })
      setIsRunning(true)
    });

    return () => {
      socket?.off(GAME_PRESENT_PROGRESS)
      socket?.off(GAME_PRESENT_PROGRESS_NEW_PLAYER)
      socket?.off(RESET_GAME)
      socket?.off(END_GAME)
      socket?.off(codeRoom)
    };
  }, [socket, gameStatus, codeRoom, progress, progressInterval, isRunning, participants, roomRound]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;

      setIsRunning(true)
    }
  }, [isRunning, participants, gameStatus, roomRound])

  return (
    <Progress
      value={progress}
      className="absolute bottom-1 w-[98%] h-2.5 left-1/2 -translate-x-1/2 bg-blue-900 border-2 border-black"
    />
  );
}
