import React, { useEffect } from "react";
import { Progress } from "./shadcn-ui/progress";
import { useGameStore } from "../stores/gameStore";

interface Props {
  maximumTimeInMiliSeconds?: number;
  hanldeWhenTimeOut?: () => void;
}

export function ProgressPlayTime({
  maximumTimeInMiliSeconds = 60*60*1000,
  hanldeWhenTimeOut = () => {
  },
}: Props) {
  const [progress, setProgress] = React.useState(100);
  const MIN_PROGRESS_PERCENTAGE = 0;
  const MAX_PROGRESS_PERCENTAGE = 100;
  const TIME_PERSTEP = 100;
  const { gameStatus } = useGameStore();

  useEffect(() => {
    if (gameStatus !== "game-start") setProgress(100);
  }, [gameStatus]);

  const number_percentage_to_decrease_per_step =
    (MAX_PROGRESS_PERCENTAGE * TIME_PERSTEP) / maximumTimeInMiliSeconds;
  React.useEffect(() => {
    const timer = setInterval(() => {
      

      setProgress((prevProgress) => {
        if (prevProgress <= MIN_PROGRESS_PERCENTAGE) {
          console.log("end")
          clearInterval(timer);
  
          hanldeWhenTimeOut();
          return prevProgress
        }
        return prevProgress - number_percentage_to_decrease_per_step;
      });
    }, TIME_PERSTEP);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Progress
      value={progress}
      className="absolute bottom-1 w-[98%] h-2.5 left-1/2 -translate-x-1/2 bg-blue-900 border-2 border-black"
    />
  );
}
