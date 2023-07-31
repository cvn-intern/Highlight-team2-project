import { GameStatus } from '../stores/gameStore';
import IntervalCanvasContent from './IntervalCanvasContent';
import IntervalCanvasHeader from './IntervalCanvasHeader';

export const INTERVAL_SHOW_WORD = 'interval-show-word';
export const INTERVAL_NOT_SHOW_WORD = 'interval-not-show-word';
export const INTERVAL_NEW_TURN = 'new-turn';
export const INTERVAL_INACTIVE = 'inactive';
export const START_GAME = 'start-game';
export const WAIT_FOR_OTHER_PLAYERS = 'wait-for-players';
export const PLAY_GAME = 'game-start';
export const GAME_PROGRESS = 'game-progress';
export const GAME_REFRESH_ROUND = 'refresh-round';

export const QUALIFY_TO_START_CHANNEL = 'qualify-to-start';
export const GAME_STATUS_CHANNEL = 'game-status';
export const GAME_NEW_TURN_CHANNEL = 'game-new-turn';
export const GAME_DRAWER_OUT_CHANNEL = 'drawer-is-out';

export const INTERVAL_DURATION_MILISECONDS = 10000;

type IntervalCanvasProps = {
  status: GameStatus;
  hidden: boolean;
};

const IntervalCanvas = ({
  status = INTERVAL_SHOW_WORD,
  hidden = true,
}: IntervalCanvasProps) => {

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
    </div>
  );
};

export default IntervalCanvas;
