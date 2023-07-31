import AnswerHitImg from "@/shared/assets/answer-hit-img.png";
import NobodyHitsImg from "@/shared/assets/nobody-hits-answer.png";
import WaitingImg from "@/shared/assets/pencil-0.jpg";
import InactiveImage from "@/shared/assets/inactive.png";
import ControllerIcon from "@/shared/assets/controller-icon.svg";
import {
  INTERVAL_NEW_TURN,
  INTERVAL_NOT_SHOW_WORD,
  INTERVAL_SHOW_WORD,
  // PLAY_GAME,
  START_GAME,
  GAME_NEW_TURN_CHANNEL,
  WAIT_FOR_OTHER_PLAYERS,
  INTERVAL_DURATION_MILISECONDS,
  GAME_PROGRESS,
} from "./IntervalCanvas";
import { Button } from "./shadcn-ui/Button";
import { useGameStore } from "../stores/gameStore";
import { useSocketStore } from "../stores/socketStore";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

const IntervalCanvasContent = ({ status = INTERVAL_SHOW_WORD }) => {
  const { socket } = useSocketStore();
  const { roomRound, isHost, correctAnswers, maxPlayer, participants } = useGameStore();
  const { codeRoom } = useParams();

  const handleStartGame = () => {
    if(!isHost || !socket) return
    socket?.emit(GAME_NEW_TURN_CHANNEL, codeRoom);
    socket?.emit(GAME_PROGRESS, {codeRoom, maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS})
  };

  const painter = useMemo(() => {
    return participants.find(participant => participant.id === roomRound?.painter)
  }, [roomRound, participants])
  
  switch (status) {
    case INTERVAL_SHOW_WORD:
      return (
        <div className="flex justify-between gap-x-20 ">
          <div className="flex flex-col items-center place-content-center">
            <p className="text-lg text-slate-300">The answer was:</p>
            <p className="text-[2.5rem]">{roomRound?.word}</p>
          </div>
          <div className="w-[180px] mt-9 ">
            <img src={AnswerHitImg} />
          </div>
          <div className="place-content-center flex flex-col">
            <p className="text-lg mt-5 text-slate-300">
              {" "}
              Correct players:
            </p>
            <p className="text-[3.5rem] mx-auto">
              {" "}
              <span className="text-cyan-700">{correctAnswers.length}</span>/<span>{maxPlayer}</span>
            </p>
          </div>
        </div>
      );
    case INTERVAL_NOT_SHOW_WORD:
      return (
        <div className="flex flex-col items-center gap-y-3">
          <div className="w-[130px] mt-5 ">
            <img src={NobodyHitsImg} />
          </div>
          <div className="place-content-center flex flex-col">
            <p className="text-[1.5rem] text-slate-300">
              {" "}
              Nobody hits the answer :(
            </p>
          </div>
        </div>
      );
    case INTERVAL_NEW_TURN:
      return (
        <div className="flex items-center mt-7">
          <img className="w-[200px]" src={painter?.avatar} />
        </div>
      );
    case WAIT_FOR_OTHER_PLAYERS:
      return (
        <div className="flex flex-col items-center gap-y-3">
          <div className="w-[70px] my-6 ">
            <img src={WaitingImg} />
          </div>
          <div className="place-content-center flex flex-col">
            <p className="text-[1.5rem] text-slate-300">
              {" "}
              {isHost ? "Wait for other players" : "Wait for the host to start the game" }
            </p>
          </div>
        </div>
      );
    case START_GAME:
      return (
        <div className="flex flex-col items-center gap-y-3">
          <div className="w-[70px] my-1 ">
            <img src={WaitingImg} />
          </div>
          <div className="place-content-center flex flex-col">
            <p className="text-[1.5rem] text-slate-300">
              {" "}
              Wait for other players
            </p>
          </div>
          <div className="place-content-center flex flex-col">
            <Button
              type="submit"
              variant="opacityHover"
              className="gap-4 rounded-full border-8 border-black font-black bg-[#FFE569] p-4"
              onClick={handleStartGame}
            >
              <img src={ControllerIcon} alt="" className="w-[20%]" />
              <p>START GAME</p>
            </Button>
          </div>
        </div>
      );
    default:
      return (
        <div className="flex items-center mt-7">
          <img className="w-[200px]" src={InactiveImage} />
        </div>
      );
  }
};

export default IntervalCanvasContent;
