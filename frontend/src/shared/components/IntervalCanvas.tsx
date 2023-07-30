import { useEffect } from "react";
import { useGameStore } from "../stores/gameStore";
import { useSocketStore } from "../stores/socketStore";
import IntervalCanvasContent from "./IntervalCanvasContent";
import IntervalCanvasHeader from "./IntervalCanvasHeader";
import { ProgressPlayTime } from "./ProcessPlayTime";

export const INTERVAL_SHOW_WORD = "interval-show-word";
export const INTERVAL_NOT_SHOW_WORD = "interval-not-show-word";
export const INTERVAL_NEW_TURN = "new-turn";
export const INTERVAL_INACTIVE = "inactive";
export const START_GAME = "start-game";
export const WAIT_FOR_OTHER_PLAYERS = "wait-for-players";
export const PLAY_GAME = "game-start";
export const QUALIFY_TO_START_CHANNEL = "qualify-to-start";

const IntervalCanvas = ({ status = INTERVAL_SHOW_WORD, hidden = true }) => {
  const { socket } = useSocketStore();
  const { setGameStatus, gameStatus } = useGameStore();

  useEffect(() => {
    socket?.on(QUALIFY_TO_START_CHANNEL, (canStart: boolean) => {
      if (canStart){
        setGameStatus(START_GAME);
      }else {
        setGameStatus(WAIT_FOR_OTHER_PLAYERS);
      }
    });

    return () => {
      socket?.off(QUALIFY_TO_START_CHANNEL);
    };
  }, [socket]);

  return (
    <div
      hidden={hidden}
      id="interval-layout"
      className={`relative overflow-hidden rounded-[10px] w-[760px] aspect-[2] flex-shrink-0 bg-white bg-no-repeat bg-center`}
    >
      <div className="flex flex-col items-center font-lilita">
        <IntervalCanvasHeader status={status} />
        <IntervalCanvasContent status={status} />
      </div>
      {gameStatus !== "start-game" && gameStatus !== "wait-for-players" && (
        <ProgressPlayTime />
      )}
    </div>
  );
};

export default IntervalCanvas;
