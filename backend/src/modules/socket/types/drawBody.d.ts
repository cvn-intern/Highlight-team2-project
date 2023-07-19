type Point = {
  x: number;
  y: number;
};

type RGBAColorType = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type StartDraw = {
    point: Point,
    color: RGBAColorType,
    penStyle: string,
    brushSize: number,
  }
  
  export type Drawing = {
    currentPoint: Point,
    color: RGBAColorType,
    penStyle: string,
    isFill: boolean,
  }