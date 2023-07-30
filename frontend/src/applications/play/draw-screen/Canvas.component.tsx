/* eslint-disable react-hooks/rules-of-hooks */
import { PaintContext } from '@/applications/play/PlayingGameScreen.component';
import { useContext, useEffect } from 'react';
import cursorsIconMap from '../shared/constants/cursorsIconMap';
// Functions
import {
  INTERVAL_SHOW_WORD,
  PLAY_GAME
} from '@/shared/components/IntervalCanvas';
import { ProgressPlayTime } from '@/shared/components/ProcessPlayTime';
import { useGameStore } from '@/shared/stores/gameStore';
import { useSocketClearCanvasEvent } from '../shared/hooks/useSocketClearCanvasEvent';
import { useSocketHandleCanvasEvent } from '../shared/hooks/useSocketHandleCanvasEvents';
import { getPointFromEvent, resetCanvas } from './draw.helper';
import { useSocketStore } from '@/shared/stores/socketStore';
import { useParams } from 'react-router-dom';

const ROUND_DURATION_MILISECONDS = 20000

type CanvasProps = {
  hidden: boolean
  isDrawer: boolean
}

const Canvas = ({ hidden = false, isDrawer = false }: CanvasProps) => {
  const variables = useContext(PaintContext);
  if (!variables) return null;
  const { canvasRef, penStyle } = variables;

  const {codeRoom} = useParams()

  const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } =
    useSocketHandleCanvasEvent();
  const { handleClickClearCanvas } = useSocketClearCanvasEvent();
  const { setGameStatus, setIsDrawer, gameStatus, isHost } = useGameStore(); 
  const { socket } = useSocketStore(); 

  const hanldeWhenTimeOut = () => {
    setGameStatus(INTERVAL_SHOW_WORD);
    setIsDrawer(false);
    if(isHost) socket?.emit(INTERVAL_SHOW_WORD, codeRoom)
  };

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return;
    if (gameStatus === PLAY_GAME) return;
    resetCanvas(
      canvasRef.current.getContext('2d', { willReadFrequently: true })
    );
  }, [canvasRef, gameStatus, handleClickClearCanvas]);

  return (
    <div
      className={` overflow-hidden rounded-[10px] w-[760px] aspect-[2] flex-shrink-0 ${
        hidden ? 'absolute translate-y-[-10000px]' : 'relative'
      }`}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        className={`w-[var(--canvas-width)] h-[var(--canvas-height)] bg-white rounded-[10px] ${
          cursorsIconMap[penStyle] ?? ''
        } ${!isDrawer && 'pointer-events-none'}`}
        onMouseDown={(e) => {
          if (!isDrawer) return;
          const point = getPointFromEvent(e);
          handleMouseDown(point);
        }}
        onMouseMove={(e) => {
          if (!isDrawer) return;
          const currentPoint = getPointFromEvent(e);
          handleMouseMove(currentPoint);
        }}
        onMouseUp={() => {
          if (!isDrawer) return;
          handleMouseUpOrLeave();
        }}
        onMouseLeave={() => {
          if (!isDrawer) return;
          handleMouseUpOrLeave();
        }}
      ></canvas>
      {gameStatus === 'game-start' && (
        <ProgressPlayTime maximumTimeInMiliSeconds={ROUND_DURATION_MILISECONDS} hanldeWhenTimeOut={hanldeWhenTimeOut} />
      )}
    </div>
  );
};

export default Canvas;
