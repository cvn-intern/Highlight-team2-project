import { useTranslation } from "react-i18next";
import { useGameStore } from "../stores/gameStore";
import {
  END_GAME,
  INTERVAL_DRAWER_OUT,
  INTERVAL_INACTIVE,
  INTERVAL_NEW_TURN,
  INTERVAL_SHOW_WORD,
  START_GAME,
  WAIT_FOR_OTHER_PLAYERS,
} from "./IntervalCanvas";

const IntervalCanvasHeader = ({ status = INTERVAL_INACTIVE }) => {
  const { participants, roomRound } = useGameStore();
  const { t } = useTranslation();
  const nextDrawer = participants.find(
    (participant) => participant.id === roomRound?.painter
  );

  switch (status) {
    case INTERVAL_SHOW_WORD:
      return (
        <>
          <p className="text-[3rem] text-sky-700">{t("interval.intervalLabel")}</p>
        </>
      );
    case INTERVAL_NEW_TURN:
      return (
        <>
          <p className="text-[3rem] text-yellow-400">{t("interval.newTurn")}</p>
          <p className="text-xl text-slate-400">
            {t("interval.turnNotify")}{" "}
            <span className="text-slate-900">{nextDrawer?.nickname}</span>
          </p>
        </>
      );
    case INTERVAL_INACTIVE:
      return (
        <>
          <p className="text-[2rem] text-red-500">{t("interval.inactive")}</p>
          <p className="text-xl text-slate-400">{t("interval.lostTurnDescription")} :(</p>
        </>
      );
    case INTERVAL_DRAWER_OUT:
      return (
        <>
          <p className="text-[3rem] text-yellow-400">{t("interval.newTurn")}</p>
        </>
      );
    case WAIT_FOR_OTHER_PLAYERS:
    case START_GAME:
      return (
        <>
          <p className="text-[3rem] text-yellow-400">{t("interval.waiting")}</p>
        </>
      );
    case END_GAME:
      return (
        <>
          <p className="text-[3rem] text-yellow-400">{t("interval.gameOver")}</p>
          <p className="text-xl text-gray-500">{t("interval.winnerDescription")}</p>
        </>
      );
    default:
      return (
        <>
          <p className="text-[3rem] text-sky-700">{t("interval.refreshRound")}</p>
        </>
      );
  }
};

export default IntervalCanvasHeader;
