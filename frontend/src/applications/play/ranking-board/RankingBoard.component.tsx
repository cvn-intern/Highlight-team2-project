import { useEffect, useState } from "react";
import UserFrame from "./UserFrame.component";
import { LucideIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import playService from "@/shared/services/playService";
import { useSocketStore } from "@/shared/stores/socketStore";
import useToaster from "@/shared/hooks/useToaster";
import { ERROR_ICON } from "@/shared/constants";

export interface ILeaderboard {
  user: {
    id: number;
    avatar: string;
    nickname: string;
  };
  score: number;
  answered_at: null | Date;
  type?: string;
  icon?: LucideIcon;
}

interface RankingUser {
  users: ILeaderboard[];
  max_player: number;
  hostId?: number;
  isCorrect?: boolean;
}

export default function RankingBoard() {
  const { socket } = useSocketStore();
  const [leaderboardData, setLeaderboardData] = useState<RankingUser>({
    users: [],
    max_player: 0,
  });
  const { codeRoom } = useParams();

  const getRoomParticipants = async () => {
    if (!codeRoom) return;
    try {
      const { data } = await playService.roomParticipants(codeRoom);
      setLeaderboardData(data);
    } catch (error) {
      useToaster({
        type: "error",
        message: "Get room participants failed!",
      })
    }
  };

  useEffect(() => {
    socket?.on(`${codeRoom}-leave`, async () => {
      await getRoomParticipants();
    });

    socket?.on(codeRoom ?? "", async () => {
      await getRoomParticipants();
    });

    return () => {
      socket?.off(`${codeRoom}-leave`);
      socket?.off(codeRoom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const numberOfPlayers = leaderboardData.users.length;

  return (
    <div className="bg-white rounded-[10px] overflow-hidden w-[var(--ranking-board-width)] h-full relative">
      <UserFrame
        Leaderboard={leaderboardData.users}
        maxPlayer={leaderboardData.max_player}
        isCorrect={false}
        hostId={-1}
        drawerId={-1}
      />
      <div className="absolute w-[44px] h-[44px] text-[12px] font-bold text-gray-300 border-2 border-gray-300 rounded-full top-2 right-2 flexCenter bg-white">
        <span>{numberOfPlayers}</span>/<span>{leaderboardData.max_player}</span>
      </div>
    </div>
  );
}
