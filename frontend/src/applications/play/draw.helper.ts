/* eslint-disable prefer-const */
import { rgbaToHex } from "@/shared/lib/colors";
import { DEFAULT_WHITE } from "./constants/color";
import { Point, RGBAColorType } from "./draw";
import { MouseEvent } from "react";

export const resetCanvas = (ctx: CanvasRenderingContext2D) => {
  if (!ctx) return;
  const hexColor = rgbaToHex(
    DEFAULT_WHITE.r,
    DEFAULT_WHITE.g,
    DEFAULT_WHITE.b,
    DEFAULT_WHITE.a
  );
  ctx.fillStyle = hexColor;
  ctx?.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
  snapshot && ctx.putImageData(snapshot, 0, 0);
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
  snapshot && ctx.putImageData(snapshot, 0, 0);
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
  if (!ctx) return;
  const { x: previousX, y: previousY } = previousPoint;
  const { x: currentX, y: currentY } = currentPoint;
  snapshot && ctx.putImageData(snapshot, 0, 0);
  ctx.moveTo(previousX, previousY);
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(currentX - previousX, 2) + Math.pow(currentY - previousY, 2)
  );
  ctx.arc(previousX, previousY, radius, 0, 2 * Math.PI);
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
  ctx.beginPath();
  snapshot && ctx.putImageData(snapshot, 0, 0);
  ctx.moveTo(previousX, previousY);
  ctx.lineTo(currentX, currentY);
  ctx.lineTo(previousX * 2 - currentX, currentY);
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
  const c_width = canvas.width;
  const c_height = canvas.height;
  const id = ctx.getImageData(0, 0, c_width, c_height);
  const pixel_pos = (y * c_width + x) * 4;
  const start_r = id.data[pixel_pos + 0];
  const start_g = id.data[pixel_pos + 1];
  const start_b = id.data[pixel_pos + 2];
  const start_a = id.data[pixel_pos + 3];

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

    pixel_pos = (y * c_width + x) * 4;
    while (matches_start_color(pixel_pos)) {
      y--;
      pixel_pos = (y * c_width + x) * 4;
    }
    reach_left = false;
    reach_right = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      y++;
      pixel_pos = (y * c_width + x) * 4;

      if (!(y < c_height && matches_start_color(pixel_pos))) {
        break;
      }
      color_pixel(pixel_pos);
      if (x > 0) {
        if (matches_start_color(pixel_pos - 4)) {
          if (!reach_left) {
            stack.push([x - 1, y]);
            reach_left = true;
          }
        } else if (reach_left) {
          reach_left = false;
        }
      }

      if (x < c_width - 1) {
        if (matches_start_color(pixel_pos + 4)) {
          if (!reach_right) {
            stack.push([x + 1, y]);
            reach_right = true;
          }
        } else if (reach_right) {
          reach_right = false;
        }
      }

      pixel_pos += c_width * 4;
    }
  }
  ctx.putImageData(id, 0, 0);

  function matches_start_color(pixel_pos: number): boolean {
    return (
      id.data[pixel_pos + 0] === start_r &&
      id.data[pixel_pos + 1] === start_g &&
      id.data[pixel_pos + 2] === start_b &&
      id.data[pixel_pos + 3] === start_a
    );
  }

  function color_pixel(pixel_pos: number): void {
    id.data[pixel_pos + 0] = fill_r;
    id.data[pixel_pos + 1] = fill_g;
    id.data[pixel_pos + 2] = fill_b;
    id.data[pixel_pos + 3] = fill_a;
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
    color.a * 255 || 255
  );
};

export const pickColor = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  setColor: (color: RGBAColorType) => void
) => {
  if (!ctx) return;
  const { x, y } = point;
  const dataImage = ctx.getImageData(x, y, 1, 1);
  const r = dataImage.data[0];
  const g = dataImage.data[1];
  const b = dataImage.data[2];
  const a = dataImage.data[3] / 255;
  const color = { r, g, b, a };
  setColor(color);
};

export const getPointFromEvent = (
  e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
): Point => {
  const x = e.nativeEvent.offsetX;
  const y = e.nativeEvent.offsetY;
  return { x, y };
};
