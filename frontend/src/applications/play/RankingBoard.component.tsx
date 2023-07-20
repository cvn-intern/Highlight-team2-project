import { useEffect, useState } from "react";
import UserFrame from "./UserFrame.component";
import { LucideIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import playService from "@/shared/services/playService";
import { useSocketStore } from "@/shared/stores/socketStore";



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
  users: ILeaderboard[],
  max_player: number;
  host?: boolean;
  is_correct?: boolean;
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
      console.log({ error });
    }
  };

  useEffect(() => {
    socket?.on(`${codeRoom}-leave`, async () => {
      // console.log({leaderboardData, data})
      // const newUsersArray = leaderboardData.filter(item => item.user.nickname !== data.user)
      // setLeaderboardData(newUsersArray)
      await getRoomParticipants();
    });

    socket?.on(codeRoom ?? "", async () => {
      await getRoomParticipants();
    });

    return () => {
      socket?.off(`${codeRoom}-leave`);
      socket?.off(codeRoom);
    };
  }, [socket]);

  return (
    <div className="bg-white rounded-[10px] overflow-hidden w-[var(--ranking-board-width)] h-full">
      <UserFrame Leaderboard={leaderboardData.users} max_player={leaderboardData.max_player} host={false} is_correct={false}/>
    </div>
  );
}
