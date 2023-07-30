import React, { useEffect } from 'react';
import { Progress } from './shadcn-ui/progress';
import { useGameStore } from '../stores/gameStore';
import { useSocketStore } from '../stores/socketStore';
import { GAME_DRAWER_OUT_CHANNEL, GAME_PROGRESS } from './IntervalCanvas';

interface Props {
  maximumTimeInMiliSeconds?: number;
  hanldeWhenTimeOut?: () => void;
}

export function ProgressPlayTime({ hanldeWhenTimeOut = () => {} }: Props) {
  const [progress, setProgress] = React.useState(100);
  
  const { socket } = useSocketStore();
  const { gameStatus } = useGameStore();

  useEffect(() => {
    if (gameStatus !== 'game-start') setProgress(100);
  }, [gameStatus]);

  useEffect(() => {
    socket?.on(GAME_PROGRESS, (progress: number) => {
      setProgress(progress);

      if (progress <= 0) {
        return hanldeWhenTimeOut();
      }
    });

    socket?.on(GAME_DRAWER_OUT_CHANNEL, () => {
     
    });

    return () => {
      socket?.off(GAME_PROGRESS);
    };
  }, [socket, gameStatus]);

  return (
    <Progress
      value={progress}
      className="absolute bottom-1 w-[98%] h-2.5 left-1/2 -translate-x-1/2 bg-blue-900 border-2 border-black"
    />
  );
}
