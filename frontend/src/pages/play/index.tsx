import { useMediaQuery } from "react-responsive";
// Components
import MainLayout from "@/common/layout/MainLayout";
import PlayingGameDesktopScreen from "./PlayingGameDesktopScreen";
import PlayingGameMobileScreen from "./PlayingGameMobileScreen";

// type Props = {};

export default function PlayingGameScreen() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const content = isDesktopOrLaptop ? (
    <PlayingGameDesktopScreen />
  ) : (
    <PlayingGameMobileScreen />
  );
  return <MainLayout>{content}</MainLayout>;
}
