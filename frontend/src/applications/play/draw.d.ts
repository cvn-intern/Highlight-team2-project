export type PaintContextType = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  ctx: CanvasRenderingContext2D | null;
  snapshot: ImageData | undefined;
  isDrawing: boolean;
  previousPoint: Point;
  color: RGBAColorType;
  penStyle: PenStyleType;
  isFill: boolean;
  brushSize: number;
  setCtx: Dispatch<SetStateAction<CanvasRenderingContext2D | null>>;
  setSnapshot: Dispatch<SetStateAction<ImageData | undefined>>;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  setPreviousPoint: Dispatch<SetStateAction<Point>>;
  setColor: Dispatch<SetStateAction<RGBAColorType>>;
  setPenStyle: Dispatch<SetStateAction<string>>;
  setIsFill: Dispatch<SetStateAction<boolean>>;
  setBrushSize: Dispatch<SetStateAction<number>>;
};

export type RGBAColorType = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type PaintToolBtnType = {
  Icon: LucideIcon;
  onChange: string;
  value: string;
};

export type Point = {
  x: number;
  y: number;
};

export type PenStyleType = "circle" | "line" | "bucket" | "picker" | "brush" | "eraser" | "rectangle" | "triangle";

export type StartDraw = {
  point: Point,
  color: RGBAColorType,
  penStyle: string,
  brushSize: number,
  ctx: CanvasRenderingContext2D
}

export type Drawing = {
  currentPoint: Point,
  color: RGBAColorType,
  penStyle: string,
  snapshot: ImageData ,
  isFill: boolean,
  ctx: CanvasRenderingContext2D
}
export type SocketStartDraw = {
  point: Point,
  color: RGBAColorType,
  penStyle: string,
  brushSize: number,
}

export type SocketDrawing = {
  currentPoint: Point,
  color: RGBAColorType,
  penStyle: string,
  isFill: boolean,
}

