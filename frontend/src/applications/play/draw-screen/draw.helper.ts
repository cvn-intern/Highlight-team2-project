const START_X_CANVAS = 0;
const START_Y_CANVAS = 0;
const ONE_PIXEL_DATA_LENGTH = 4;
const RED_INDEX_OF_ONE_PIXEL = 0;
const GREEN_INDEX_OF_ONE_PIXEL = 1;
const BLUE_INDEX_OF_ONE_PIXEL = 2;
const ALPHA_INDEX_OF_ONE_PIXEL = 3;
const MAX_ALPHA_IN_RANGE_255 = 255;

/* eslint-disable prefer-const */
import { rgbaToHex } from "@/shared/lib/colors";
import { DEFAULT_WHITE } from "../shared/constants/color";
import { Point, RGBAColorType } from "./draw";
import { MouseEvent } from "react";

const scaleAlphaFromRange255ToRange1 = (alpha: number) =>
  alpha / MAX_ALPHA_IN_RANGE_255;
const scaleAlphaFromRange1ToRange255 = (alpha: number) =>
  alpha * MAX_ALPHA_IN_RANGE_255;

export const resetCanvas = (ctx: CanvasRenderingContext2D) => {
  if (!ctx) return;
  const hexColor = rgbaToHex(
    DEFAULT_WHITE.r,
    DEFAULT_WHITE.g,
    DEFAULT_WHITE.b,
    DEFAULT_WHITE.a
  );
  ctx.fillStyle = hexColor;
  ctx?.fillRect(
    START_X_CANVAS,
    START_Y_CANVAS,
    ctx.canvas.width,
    ctx.canvas.height
  );
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  snapshot: ImageData,
  currentPoint: Point,
  previousPoint: Point
) => {
  if (!ctx) return;
  const { x: previousX, y: previousY } = previousPoint;
  const { x: currentX, y: currentY } = currentPoint;
  ctx.beginPath();
  snapshot && ctx.putImageData(snapshot, START_X_CANVAS, START_Y_CANVAS);
  ctx.moveTo(previousX, previousY);
  ctx.lineTo(currentX, currentY);
  ctx.lineCap = "round";
  ctx.stroke();
};

export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  snapshot: ImageData,
  currentPoint: Point,
  previousPoint: Point,
  isFill: boolean
) => {
  if (!ctx) return;
  const { x: previousX, y: previousY } = previousPoint;
  const { x: currentX, y: currentY } = currentPoint;
  ctx.beginPath();
  snapshot && ctx.putImageData(snapshot, START_X_CANVAS, START_Y_CANVAS);
  ctx.rect(previousX, previousY, currentX - previousX, currentY - previousY);
  isFill ? ctx.fill() : ctx.stroke();
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  snapshot: ImageData,
  currentPoint: Point,
  previousPoint: Point,
  isFill: boolean
) => {
  const ROTATION_START = 0;
  const ROTATION_RANGE = 2 * Math.PI;
  if (!ctx) return;
  const { x: previousX, y: previousY } = previousPoint;
  const { x: currentX, y: currentY } = currentPoint;
  snapshot && ctx.putImageData(snapshot, START_X_CANVAS, START_Y_CANVAS);
  ctx.moveTo(previousX, previousY);
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(currentX - previousX, 2) + Math.pow(currentY - previousY, 2)
  );
  ctx.arc(previousX, previousY, radius, ROTATION_START, ROTATION_RANGE);
  isFill ? ctx.fill() : ctx.stroke();
};

export const drawTriangle = (
  ctx: CanvasRenderingContext2D,
  snapshot: ImageData,
  currentPoint: Point,
  previousPoint: Point,
  isFill: boolean
) => {
  if (!ctx) return;
  const { x: previousX, y: previousY } = previousPoint;
  const { x: currentX, y: currentY } = currentPoint;
  const THIRD_POINT_X = previousX * 2 - currentX;
  ctx.beginPath();
  snapshot && ctx.putImageData(snapshot, START_X_CANVAS, START_Y_CANVAS);
  ctx.moveTo(previousX, previousY);
  ctx.lineTo(currentX, currentY);
  ctx.lineTo(THIRD_POINT_X, currentY);
  ctx.closePath();
  isFill ? ctx.fill() : ctx.stroke();
};

export const drawFreeStyle = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: RGBAColorType
) => {
  if (!ctx) return;
  const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
  ctx.strokeStyle = hexColor;
  ctx.lineCap = "round";
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
};

export const eraser = (ctx: CanvasRenderingContext2D, point: Point) => {
  if (!ctx) return;
  const hexBgColor = rgbaToHex(
    DEFAULT_WHITE.r,
    DEFAULT_WHITE.g,
    DEFAULT_WHITE.b,
    DEFAULT_WHITE.a
  );
  ctx.strokeStyle = hexBgColor;
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
};

export const fillColorIntoCanvas = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  fill_r: number,
  fill_g: number,
  fill_b: number,
  fill_a: number
) => {
  const { x, y } = point;
  const canvas = ctx.canvas;
  const canvas_width = canvas.width;
  const canvas_height = canvas.height;
  const id = ctx.getImageData(
    START_X_CANVAS,
    START_Y_CANVAS,
    canvas_width,
    canvas_height
  );
  const pixel_pos = convertFromCoordinatesToIndex(x, y, canvas_width);
  const start_r = id.data[pixel_pos + RED_INDEX_OF_ONE_PIXEL];
  const start_g = id.data[pixel_pos + GREEN_INDEX_OF_ONE_PIXEL];
  const start_b = id.data[pixel_pos + BLUE_INDEX_OF_ONE_PIXEL];
  const start_a = id.data[pixel_pos + ALPHA_INDEX_OF_ONE_PIXEL];

  if (
    fill_r === start_r &&
    fill_g === start_g &&
    fill_b === start_b &&
    fill_a === start_a
  ) {
    return;
  }

  const stack: [number, number][] = [[x, y]];

  while (stack.length) {
    let new_pos, x, y, pixel_pos, reach_left, reach_right;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    new_pos = stack.pop()!;
    x = new_pos[0];
    y = new_pos[1];

    pixel_pos = convertFromCoordinatesToIndex(x, y, canvas_width);
    while (matchesStartColor(pixel_pos)) {
      y--;
      pixel_pos = convertFromCoordinatesToIndex(x, y, canvas_width);
    }
    reach_left = false;
    reach_right = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      y++;
      pixel_pos = convertFromCoordinatesToIndex(x, y, canvas_width);

      if (!(y < canvas_height && matchesStartColor(pixel_pos))) {
        break;
      }
      colorPixel(pixel_pos);

      if (x > 0 && matchesStartColor(prevPixel(pixel_pos)) && !reach_left) {
        stack.push([x - 1, y]);
      }
      reach_left = !reach_left;

      if (
        x < canvas_width - 1 &&
        matchesStartColor(nextPixel(pixel_pos)) &&
        !reach_right
      ) {
        stack.push([x + 1, y]);
      }
      reach_right = !reach_right;

      pixel_pos += canvas_width * ONE_PIXEL_DATA_LENGTH;
    }
  }
  ctx.putImageData(id, START_X_CANVAS, START_Y_CANVAS);

  function matchesStartColor(pixel_pos: number): boolean {
    return (
      id.data[pixel_pos + RED_INDEX_OF_ONE_PIXEL] === start_r &&
      id.data[pixel_pos + GREEN_INDEX_OF_ONE_PIXEL] === start_g &&
      id.data[pixel_pos + BLUE_INDEX_OF_ONE_PIXEL] === start_b &&
      id.data[pixel_pos + ALPHA_INDEX_OF_ONE_PIXEL] === start_a
    );
  }

  function colorPixel(pixel_pos: number): void {
    id.data[pixel_pos + RED_INDEX_OF_ONE_PIXEL] = fill_r;
    id.data[pixel_pos + GREEN_INDEX_OF_ONE_PIXEL] = fill_g;
    id.data[pixel_pos + BLUE_INDEX_OF_ONE_PIXEL] = fill_b;
    id.data[pixel_pos + ALPHA_INDEX_OF_ONE_PIXEL] = fill_a;
  }

  function nextPixel(pixel_pos: number): number {
    return pixel_pos + ONE_PIXEL_DATA_LENGTH;
  }

  function prevPixel(pixel_pos: number): number {
    return pixel_pos - ONE_PIXEL_DATA_LENGTH;
  }

  function convertFromCoordinatesToIndex(
    x: number,
    y: number,
    canvas_width: number
  ): number {
    return (y * canvas_width + x) * ONE_PIXEL_DATA_LENGTH;
  }
};

export const fillWithColor = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: RGBAColorType
) => {
  if (!ctx) return;
  const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
  ctx.fillStyle = hexColor;
  fillColorIntoCanvas(
    ctx,
    point,
    color.r,
    color.g,
    color.b,
    scaleAlphaFromRange1ToRange255(color.a) || MAX_ALPHA_IN_RANGE_255
  );
};

export const pickColor = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  setColor: (color: RGBAColorType) => void
) => {
  const IMAGE_LENGTH = 1;
  const IMAGE_HEIGHT = 1;
  if (!ctx) return;
  const { x, y } = point;
  const dataImage = ctx.getImageData(x, y, IMAGE_LENGTH, IMAGE_HEIGHT);
  const r = dataImage.data[RED_INDEX_OF_ONE_PIXEL];
  const g = dataImage.data[GREEN_INDEX_OF_ONE_PIXEL];
  const b = dataImage.data[BLUE_INDEX_OF_ONE_PIXEL];
  const a = scaleAlphaFromRange255ToRange1(
    dataImage.data[ALPHA_INDEX_OF_ONE_PIXEL]
  );
  const color = { r, g, b, a };
  setColor(color);
};

// export const getPointFromEvent = (
//   e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
// ): Point => {
//   //Check if e is MouseEvent
//   const X_COMPARE_TO_CANVAS = e.nativeEvent.offsetX;
//   const Y_COMPARE_TO_CANVAS = e.nativeEvent.offsetY;
//   return { x: X_COMPARE_TO_CANVAS, y: Y_COMPARE_TO_CANVAS };
// };

export const getPointFromEvent = (
  e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent> | any
): Point => {
  let clientX = 0;
  let clientY = 0;

  if (e.type.startsWith("mouse")) {
    clientX = e.nativeEvent.offsetX;
    clientY = e.nativeEvent.offsetY;
  } else if (e.type.startsWith("touch")) {
    // For mobile devices with touch events
    const touch = e.touches[0] || e.changedTouches[0];
    const canvas = e.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    clientX = (touch.clientX - rect.left) * scaleX;
    clientY = (touch.clientY - rect.top) * scaleY;
  }

  return { x: clientX, y: clientY };
};
