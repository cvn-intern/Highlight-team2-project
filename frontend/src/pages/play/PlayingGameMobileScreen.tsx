import { useParams } from "react-router-dom";

// type Props = {}

export default function PlayingGameMobileScreen() {
  const { roomId } = useParams();
  return <div>PlayingGameMobileScreen {roomId}</div>;
}
