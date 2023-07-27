import { useEffect } from "react";
import UserFrame from "./UserFrame.component";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useGameStore } from "@/shared/stores/gameStore";

interface RankingUser {
  participants: Array<Participant>;
  max_player: number;
}

export default function RankingBoard() {
  const { socket } = useSocketStore();
  const { participants, maxPlayer, setParticipants, setMaxPlayer } =
    useGameStore();

  useEffect(() => {
    socket?.on("participants", (data: RankingUser) => {
      console.log(data);
      setParticipants(data.participants);
      setMaxPlayer(data.max_player);
    });

    return () => {
      socket?.off("participants");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const numberOfPlayers = participants.length;

  return (
    <div className="bg-white rounded-[10px] overflow-hidden w-[var(--ranking-board-width)] h-full relative">
      <UserFrame
        Leaderboard={participants}
        maxPlayer={maxPlayer}
        isCorrect={false}
      />
      <div className="absolute w-[44px] h-[44px] text-[12px] font-bold text-gray-300 border-2 border-gray-300 rounded-full top-2 right-2 flexCenter bg-white">
        <span>{numberOfPlayers}</span>/<span>{maxPlayer}</span>
      </div>
    </div>
  );
}
