// import { useParams } from "react-router-dom";
// Components
import RankingBoard from "./components/PlayingGameDesktopScreen/RankingBoard";
import Main from "./components/PlayingGameDesktopScreen/Main";
import PaintTools from "./components/PlayingGameDesktopScreen/PaintTools";

// type Props = {}

export default function PlayingGameDesktopScreen() {
  // const { roomId } = useParams();
  return (
    <div className="flex px-10 py-[56px] gap-6 h-full">
      <RankingBoard />
      <Main />
      <PaintTools />
    </div>
  );
}
