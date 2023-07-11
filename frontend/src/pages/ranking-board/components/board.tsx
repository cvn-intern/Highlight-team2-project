import Profiles from './profile';
import { Leaderboard } from './mockdata';

export default function Board() {

  const ranking_order = (data: typeof Leaderboard) => {
    // sort with descending order
    return data.sort((a, b) => b.score - a.score);
  };

  return (
    <div className="board">
      <Profiles Leaderboard={ranking_order(Leaderboard)} />
    </div>
  );
}
