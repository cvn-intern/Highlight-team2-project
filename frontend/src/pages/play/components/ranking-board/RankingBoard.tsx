import { useEffect, useState } from "react";
import UserFrame from './UserFrame';
import { LucideIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import playService from "@/common/lib/services/playService";
import { useSocketStore } from "@/common/stores/socketStore";


export interface ILeaderboard {
  user: {
    id: number;
    avatar: string;
    nickname: string;
  };
  score: number;
  answered_at: null | Date
  type?: string;
  icon?: LucideIcon;
}

export default function RankingBoard() {
  const {socket} = useSocketStore()
  const [leaderboardData, setLeaderboardData] = useState<ILeaderboard[]>([]);
  const { codeRoom } = useParams()

  const rankingOrder = (data: ILeaderboard[]) => {
    return data.sort((a, b) => b.score - a.score);
  };

  const getRoomParticipants = async () => {
    if(!codeRoom) return
    try {
      const {data} = await playService.roomParticipants(codeRoom)
      console.log({data})
      setLeaderboardData(data.data)

    } catch (error) {
      console.log({error})
    }
  }

  // useEffect(() => {
  //   socket?.on(`${codeRoom}-leave`, async () => {
  //     // console.log({leaderboardData, data})
  //     // const newUsersArray = leaderboardData.filter(item => item.user.nickname !== data.user)
  //     // setLeaderboardData(newUsersArray)
  //     await getRoomParticipants()
  //   })

  //   socket?.on(codeRoom ?? "", async () => {
  //     await getRoomParticipants()
  //   })

  //   return () => {
  //     socket?.off(`${codeRoom}-leave`)
  //     socket?.off(codeRoom)
  //   }

  // }, [socket])


  return (
    <div className="board">
      <UserFrame Leaderboard={rankingOrder(leaderboardData)} />
    </div>
  );
}