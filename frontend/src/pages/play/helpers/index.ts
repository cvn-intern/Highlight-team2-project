/* eslint-disable prefer-const */
import { MouseEvent } from "react";
import { rgbaToHex } from "@/common/lib/colors";
import { DEFAULT_WHITE } from "../constants/color";
import { RGBAColorType } from "../config/types";

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
  e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>,
  startX: number,
  startY: number
) => {
  if (!ctx) return;
  ctx.beginPath();
  snapshot && ctx.putImageData(snapshot, 0, 0);
  ctx.moveTo(startX, startY);
  ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  ctx.lineCap = "round";
  ctx.stroke();
};

export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  snapshot: ImageData,
  currentX: number,
  currentY: number,
  startX: number,
  startY: number,
  isFill: boolean
) => {
  if (!ctx) return;
  ctx.beginPath();
  snapshot && ctx.putImageData(snapshot, 0, 0);
  ctx.rect(
    startX,
    startY,
    currentX,
    currentY
  );
  isFill ? ctx.fill() : ctx.stroke();
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  snapshot: ImageData,
  e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>,
  startX: number,
  startY: number,
  isFill: boolean
) => {
  if (!ctx) return;
  snapshot && ctx.putImageData(snapshot, 0, 0);
  ctx.moveTo(startX, startY);
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(e.nativeEvent.offsetX - startX, 2) +
      Math.pow(e.nativeEvent.offsetY - startY, 2)
  );
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
  isFill ? ctx.fill() : ctx.stroke();
};

export const drawTriangle = (
  ctx: CanvasRenderingContext2D,
  snapshot: ImageData,
  e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>,
  startX: number,
  startY: number,
  isFill: boolean
) => {
  if (!ctx) return;
  ctx.beginPath();
  snapshot && ctx.putImageData(snapshot, 0, 0);
  ctx.moveTo(startX, startY);
  ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  ctx.lineTo(startX * 2 - e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  ctx.closePath();
  isFill ? ctx.fill() : ctx.stroke();
};

export const drawFreeStyle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: RGBAColorType
) => {
  
  if (!ctx) return;
  const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
  ctx.strokeStyle = hexColor;
  ctx.lineCap = "round";
  ctx.lineTo(x, y);
  ctx.stroke();
};

export const eraser = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  if (!ctx) return;
  const hexBgColor = rgbaToHex(
    DEFAULT_WHITE.r,
    DEFAULT_WHITE.g,
    DEFAULT_WHITE.b,
    DEFAULT_WHITE.a
  );
  ctx.strokeStyle = hexBgColor;
  ctx.lineTo(x, y);
  ctx.stroke();
};

export const fillColorIntoCanvas = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fill_r: number,
  fill_g: number,
  fill_b: number,
  fill_a: number
) => {
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
  x: number,
  y: number,
  color: RGBAColorType
) => {
  if (!ctx) return;
  const hexColor = rgbaToHex(color.r, color.g, color.b, color.a);
  ctx.fillStyle = hexColor;
  fillColorIntoCanvas(
    ctx,
    x,
    y,
    color.r,
    color.g,
    color.b,
    color.a * 255 || 255
  );
};

export const pickColor = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  setColor: (color: RGBAColorType) => void
) => {
  if (!ctx) return;
  const dataImage = ctx.getImageData(x, y, 1, 1);
  const r = dataImage.data[0];
  const g = dataImage.data[1];
  const b = dataImage.data[2];
  const a = dataImage.data[3] / 255;
  const color = { r, g, b, a };
  setColor(color);
};
