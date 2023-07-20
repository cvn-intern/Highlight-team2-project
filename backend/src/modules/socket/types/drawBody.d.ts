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
  codeRoom: string,
    point: Point,
    color: RGBAColorType,
    penStyle: string,
    brushSize: number,
  }
  
  export type Drawing = {
    codeRoom: string,
    currentPoint: Point,
    color: RGBAColorType,
    penStyle: string,
    isFill: boolean,
  }

  export type GetCanvasState = {
    codeRoom: string,
    dataImg: string,
    id: string
  }