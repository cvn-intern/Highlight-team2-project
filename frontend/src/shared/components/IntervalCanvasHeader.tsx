import { useGameStore } from "../stores/gameStore";
import {
  END_GAME,
  INTERVAL_DRAWER_OUT,
  INTERVAL_INACTIVE,
  INTERVAL_NEW_TURN,
  START_GAME,
  WAIT_FOR_OTHER_PLAYERS,
} from "./IntervalCanvas";

const IntervalCanvasHeader = ({ status = INTERVAL_INACTIVE }) => {
  const { participants, roomRound } = useGameStore();
  const nextDrawer = participants.find(
    (participant) => participant.id === roomRound?.painter
  );

  switch (status) {
    case INTERVAL_NEW_TURN:
      return (
        <>
          <p className="text-[3rem] text-yellow-400">NEW TURN</p>
          <p className="text-xl text-slate-400">
            It's the turn of{" "}
            <span className="text-slate-900">{nextDrawer?.nickname}</span>
          </p>
        </>
      );
    case INTERVAL_INACTIVE:
      return (
        <>
          <p className="text-[2rem] text-red-500">INACTIVE</p>
          <p className="text-xl text-slate-400">You've lost your turn :(</p>
        </>
      );
    case INTERVAL_DRAWER_OUT:
      return (
        <>
          <p className="text-[3rem] text-yellow-400">NEW TURN</p>
        </>
      );
    case WAIT_FOR_OTHER_PLAYERS:
    case START_GAME:
      return (
        <>
          <p className="text-[3rem] text-yellow-400">WAITING</p>
        </>
      );
    case END_GAME:
      return (
        <>
          <p className="text-[3rem] text-yellow-400">GAME OVER</p>
          <p className="text-xl text-gray-500">the winner is:</p>
        </>
      );
    default:
      return (
        <>
          <p className="text-[3rem] text-sky-700">REFRESHING ROUND</p>
        </>
      );
  }
};

export default IntervalCanvasHeader;
