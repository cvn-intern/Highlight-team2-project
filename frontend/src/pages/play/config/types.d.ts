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
  setCtx: (ctx: CanvasRenderingContext2D | null) => void;
  setSnapshot: (snapshot: ImageData) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setStartX: (startX: number) => void;
  setStartY: (startY: number) => void;
  setColor: (color: RGBAColorType) => void;
  setPenStyle: (penStyle: string) => void;
  setIsFill: (isFill: boolean) => void;
  setBrushSize: (brushSize: number) => void;
};
