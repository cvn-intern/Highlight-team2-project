export type RGBAColorType = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type PaintContextType = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  ctx: CanvasRenderingContext2D | null;
  snapshot: ImageData | undefined;
  isDrawing: boolean;
  startX: number;
  startY: number;
  color: RGBAColorType;
  penStyle: string;
  isFill: boolean;
  brushSize: number;
  setCtx: Dispatch<SetStateAction<CanvasRenderingContext2D | null>>;
  setSnapshot: Dispatch<SetStateAction<ImageData | undefined>>;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  setStartX: Dispatch<SetStateAction<number>>;
  setStartY: Dispatch<SetStateAction<number>>;
  setColor: Dispatch<SetStateAction<RGBAColorType>>;
  setPenStyle: Dispatch<SetStateAction<string>>;
  setIsFill: Dispatch<SetStateAction<boolean>>;
  setBrushSize: Dispatch<SetStateAction<number>>;
};

export type PaintToolBtnType = {
  Icon: LucideIcon;
  onChange: string;
  value: string;
};
