import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
// Variables
import { DEFAULT_BLACK } from "./constants/color";
// Components
import MainLayout from "@/common/layout/MainLayout";
import PlayingGameDesktopScreen from "./PlayingGameDesktopScreen";
import PlayingGameMobileScreen from "./PlayingGameMobileScreen";

// type Props = {};

export default function PlayingGameScreen() {
  // States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Effects
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
