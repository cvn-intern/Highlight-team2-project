import { Leaderboard } from './mockdata';
import UserFrame from './UserFrame';

export default function RankingBoard() {

  const ranking_order = (data: typeof Leaderboard) => {
    // sort with descending order
    return data.sort((a, b) => b.score - a.score);
  };

  return (
    <div className="board">
      <UserFrame Leaderboard={ranking_order(Leaderboard)} />
    </div>
  );
}
