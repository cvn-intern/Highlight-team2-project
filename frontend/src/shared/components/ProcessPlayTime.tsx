import { useState, useEffect } from 'react';
import { Progress } from './shadcn-ui/progress';
import { useGameStore } from '../stores/gameStore';
import { useSocketStore } from '../stores/socketStore';
import { GAME_DRAWER_OUT_CHANNEL, GAME_NEW_TURN_CHANNEL, GAME_PRESENT_PROGRESS, GAME_PRESENT_PROGRESS_NEW_PLAYER, GAME_PROGRESS, INTERVAL_DURATION_MILISECONDS, INTERVAL_NEW_TURN, INTERVAL_SHOW_WORD, PLAY_GAME, START_GAME, WAIT_FOR_OTHER_PLAYERS } from './IntervalCanvas';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { ROUND_DURATION_MILISECONDS } from '@/applications/play/draw-screen/Canvas.component';
import { GamePresentProgressPackage } from '../types/gameProgress';

export const MIN_PROGRESS_PERCENTAGE = 0;
export const MAX_PROGRESS_PERCENTAGE = 100;
export const TIME_PERSTEP = 100;

export function ProgressPlayTime() {
  const [progress, setProgress] = useState(100);

  const { socket } = useSocketStore();
  const { gameStatus, isHost, setGameStatus } = useGameStore();
  const { codeRoom } = useParams()

  const handleProgressTimeout = (status: string) => {
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

      case INTERVAL_SHOW_WORD:
        socket.emit(GAME_NEW_TURN_CHANNEL, codeRoom);
        socket.emit(GAME_PRESENT_PROGRESS, { codeRoom, maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS, startProgress: 100, status: INTERVAL_NEW_TURN, sendAt: moment() })
        return
    }
  }

  useEffect(() => {
    if (gameStatus !== 'game-start') setProgress(100);
  }, [gameStatus]);

  let progressInterval: any

  const handleIntervalProgress = (data: GamePresentProgressPackage) => {
    if (progressInterval) clearInterval(progressInterval)

    let { startProgress } = data
    const { maximumTimeInMiliSeconds, status, sendAt } = data
    const duration = moment.duration(moment().diff(sendAt));
    const miliseconds = duration.asMilliseconds();
    const percentageDescreasePerStep =
      (MAX_PROGRESS_PERCENTAGE * TIME_PERSTEP) / (maximumTimeInMiliSeconds - miliseconds);
    setGameStatus(status)
    setProgress(startProgress)

    progressInterval = setInterval(() => {
      if (startProgress <= MIN_PROGRESS_PERCENTAGE) {
        clearInterval(progressInterval);
        return handleProgressTimeout(status);
      }
      startProgress = startProgress - percentageDescreasePerStep
      setProgress(startProgress)
    }, TIME_PERSTEP)
  }

  useEffect(() => {
    socket?.on(GAME_PRESENT_PROGRESS, (data: any) => {
      handleIntervalProgress(data)
    });

    socket?.on(GAME_PRESENT_PROGRESS_NEW_PLAYER, (data: any) => {
      handleIntervalProgress(data)
    });

    if (!codeRoom) return
    socket?.on(codeRoom, ({ socketId }: MessageReceiver) => {
      if (!isHost || !socketId || gameStatus === START_GAME || gameStatus === WAIT_FOR_OTHER_PLAYERS) return
      socket.emit(GAME_PRESENT_PROGRESS_NEW_PLAYER,
        { socketId, codeRoom, maximumTimeInMiliSeconds: gameStatus === PLAY_GAME ? ROUND_DURATION_MILISECONDS : INTERVAL_DURATION_MILISECONDS, startProgress: progress, status: gameStatus, sendAt: moment() })
    });

    return () => {
      socket?.off(GAME_PRESENT_PROGRESS)
      socket?.off(GAME_PRESENT_PROGRESS_NEW_PLAYER)
      socket?.off(codeRoom)
    };
  }, [socket, gameStatus, isHost, codeRoom, progress]);
  return (
    <Progress
      value={progress}
      className="absolute bottom-1 w-[98%] h-2.5 left-1/2 -translate-x-1/2 bg-blue-900 border-2 border-black"
    />
  );
}
