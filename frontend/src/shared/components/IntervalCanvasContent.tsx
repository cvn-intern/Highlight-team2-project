import AnswerHitImg from "@/shared/assets/answer-hit-img.png";
import NobodyHitsImg from "@/shared/assets/nobody-hits-answer.png";
import WaitingImg from "@/shared/assets/pencil-0.jpg";
import InactiveImage from "@/shared/assets/inactive.png";
import ControllerIcon from "@/shared/assets/controller-icon.svg";
import RankFirst from "@/shared/assets/rank_first.svg";
import RankSecond from "@/shared/assets/rank_second.svg";
import RankThird from "@/shared/assets/rank_third.svg";
import FlorLeft from "@/shared/assets/florLeft.svg";
import FlorRight from "@/shared/assets/florRight.svg";
import PainterIsOut from "@/shared/assets/painter_was_out.png";
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
  END_GAME,
  INTERVAL_DRAWER_OUT,
} from "./IntervalCanvas";
import Confetti from "react-confetti";
import { Button } from "./shadcn-ui/Button";
import { useGameStore } from "../stores/gameStore";
import { useSocketStore } from "../stores/socketStore";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn-ui/avatar-shadcn";
import { cn } from "../lib/utils";

const IntervalCanvasContent = ({ status = INTERVAL_SHOW_WORD }) => {
  const { socket } = useSocketStore();
  const { roomRound, isHost, correctAnswers, maxPlayer, participants } = useGameStore();
  const { codeRoom } = useParams();

  const swapPositionRanking = (top3Users: Participant[]): Participant[] => {
    const temp: Participant = top3Users[0]
    top3Users[0] = top3Users[1]
    top3Users[1] = temp
    return top3Users
  }

  const handleTop3Ranking = (listParticipant: Participant[]): Participant[] => {
    const usersInRoom: number = 3
    if (listParticipant.length >= usersInRoom) {
      const top3Users: Participant[] = [...listParticipant.slice(0, 3)]
      top3Users[0].is_winner = true
      return swapPositionRanking(top3Users)
    }
    const userWinner: Participant[] = [...[listParticipant[0]]]
    userWinner[0].is_winner = true
    return userWinner
  }

  const handleStartGame = () => {
    if (!isHost || !socket) return;
    socket?.emit(GAME_NEW_TURN_CHANNEL, codeRoom);
    socket?.emit(GAME_PROGRESS, {
      codeRoom,
      maximumTimeInMiliSeconds: INTERVAL_DURATION_MILISECONDS,
    });
  };

  const painter = useMemo(() => {
    return participants.find(
      (participant) => participant.id === roomRound?.painter
    );
  }, [roomRound, participants]);


  switch (status) {
    case INTERVAL_SHOW_WORD:
      return (
        <div className="flex justify-between gap-x-20 ">
          <div className="flex flex-col items-center place-content-center">
            <p className="text-lg text-slate-300">The answer was:</p>
            <p className="text-[2.5rem]">{roomRound?.word}</p>
          </div>
          <div className="w-[180px] mt-12 animate-spin">
            <img src={AnswerHitImg} />
          </div>
          <div className="place-content-center flex flex-col">
            <p className="text-lg mt-5 text-slate-300"> Correct players:</p>
            <p className="text-[3.5rem] mx-auto">
              {" "}
              <span className="text-cyan-700">{correctAnswers.length}</span>/
              <span>{maxPlayer}</span>
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
    case INTERVAL_DRAWER_OUT:
      return (
        <>
          <div className="flex relative justify-center items-center mt-2 mb-4 transform -translate-y-5">
            <img className="w-1/3" src={PainterIsOut} />
          </div>
          <p className="text-xl absolute bottom-6 text-slate-500">Painter has left the room :(</p>
        </>
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
              {isHost
                ? "Wait for other players"
                : "Wait for the host to start the game"}
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
    case END_GAME:
      return (
        <>
          <Confetti numberOfPieces={250} width={1000} height={1000} />
          <div className={cn("flex flex-row justify-center items-center gap-y-3 h-60 mt-3",
            {
              "w-full": participants.length >= 3,
              "w-[45%]": participants.length < 3
            })}>
            <div className="flex flex-row w-4/5 h-4/5 justify-around">

              {participants && handleTop3Ranking(participants).map((item: Participant, index: number) => (
                <div className={cn("flex-auto", {
                  'w-60': item.is_winner,
                  'w-32 transform translate-y-7': !item.is_winner
                })
                }>
                  <div className="flex flex-col justify-center items-center h-full">
                    <div className="flex flex-row justify-center">
                      {item.is_winner && (<img
                        className="h-full transform translate-x-1/4"
                        src={FlorLeft}
                      />)}
                      <Avatar className={cn("relative flex items-center h-auto group-hover:scale-110 overflow-visible border-4 border-black border-solid",
                        {
                          "w-[60%]": item.is_winner,
                          "w-5/6": !item.is_winner
                        }
                      )}>
                        <AvatarImage
                          src={item.avatar}
                          alt="avatar"
                          className="border-2 border-white border-solid rounded-full"
                        />
                        <AvatarFallback>Avatar</AvatarFallback>
                        <img
                          className="absolute w-[45%] top-1/2 left-1/2 transform -translate-y-[-70%] -translate-x-1/2"
                          src={item.is_winner ? RankFirst : (index === 0 ? RankSecond : RankThird)}
                        />
                      </Avatar>
                      {item.is_winner && (<img
                        className="h-full transform -translate-x-1/4"
                        src={FlorRight}
                      />)}
                    </div>
                    <p className={cn("text-2xl text-slate-800",
                      {
                        "mt-16": item.is_winner,
                        "mt-9": !item.is_winner
                      }
                    )}>{item.nickname}</p>
                  </div>
                </div>
              ))}


            </div>
          </div>
        </>
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
