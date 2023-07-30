import React, { useEffect } from 'react';
import { Progress } from './shadcn-ui/progress';
import { useGameStore } from '../stores/gameStore';
import { useSocketStore } from '../stores/socketStore';
import { useParams } from 'react-router-dom';

interface Props {
  maximumTimeInMiliSeconds?: number;
  hanldeWhenTimeOut?: () => void;
}

const GAME_PROGRESS = 'game-progress'

export function ProgressPlayTime({
  maximumTimeInMiliSeconds = 60 * 60 * 1000,
  hanldeWhenTimeOut = () => {},
}: Props) {
  const [progress, setProgress] = React.useState(100);
  const MIN_PROGRESS_PERCENTAGE = 0;
  const MAX_PROGRESS_PERCENTAGE = 100;
  const TIME_PERSTEP = 100;

  const { socket } = useSocketStore();
  const { gameStatus, isHost } = useGameStore();
  const { codeRoom } = useParams();

  useEffect(() => {
    if (gameStatus !== 'game-start') setProgress(100);
  }, [gameStatus]);

  const number_percentage_to_decrease_per_step =
    (MAX_PROGRESS_PERCENTAGE * TIME_PERSTEP) / maximumTimeInMiliSeconds;

  let timer;
  React.useEffect(() => {
    if (!isHost) return;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= MIN_PROGRESS_PERCENTAGE) {
          clearInterval(timer);

          hanldeWhenTimeOut();
          return prevProgress;
        }
        const newProgress =
          prevProgress - number_percentage_to_decrease_per_step;
        socket?.emit(GAME_PROGRESS, { codeRoom, progress: newProgress });
        return newProgress;
      });
    }, TIME_PERSTEP);

    return () => {
      clearInterval(timer);
    };
  }, [socket, isHost]);

  useEffect(() => {
    if (isHost || !socket) return;
    socket.on(GAME_PROGRESS, (progress: number) => {
      setProgress(progress);
      if (progress <= 0) hanldeWhenTimeOut();
    });
    return () => {
      socket.off(GAME_PROGRESS);
    };
  }, [socket, isHost]);

  return (
    <Progress
      value={progress}
      className="absolute bottom-1 w-[98%] h-2.5 left-1/2 -translate-x-1/2 bg-blue-900 border-2 border-black"
    />
  );
}
