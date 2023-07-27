import { useEffect, useState } from "react";
import UserFrame from "./UserFrame.component";
import { useSocketStore } from "@/shared/stores/socketStore";

interface RankingUser {
  participants: Array<Participant>,
  max_player: number,
}

export default function RankingBoard() {
  const { socket } = useSocketStore();
  const [leaderboardData, setLeaderboardData] = useState<RankingUser>({
    participants: [],
    max_player: 0,
  });

  useEffect(() => {
    socket?.on('participants', (data: RankingUser) => {
      setLeaderboardData(data);
    })

    return () => {
      socket?.off('participants');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const numberOfPlayers = leaderboardData.participants.length;

  return (
    <div className="bg-white rounded-[10px] overflow-hidden w-[var(--ranking-board-width)] h-full relative">
      <UserFrame
        Leaderboard={leaderboardData.participants}
        maxPlayer={leaderboardData.max_player}
        isCorrect={false}
      />
      <div className="absolute w-[44px] h-[44px] text-[12px] font-bold text-gray-300 border-2 border-gray-300 rounded-full top-2 right-2 flexCenter bg-white">
        <span>{numberOfPlayers}</span>/<span>{leaderboardData.max_player}</span>
      </div>
    </div>
  );
}
