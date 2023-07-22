// Convert color from rbga standard to hex standard
export const rgbaToHex = (
  red: number,
  green: number,
  blue: number,
  alpha: number
): string => {
  const MAX_ALPHA_IN_255_SCALE = 255;
  const toHex = (value: number, isAlpha = false) => {
    const hex = isAlpha
      ? Math.round(value * MAX_ALPHA_IN_255_SCALE).toString(16)
      : value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return "#" + toHex(red) + toHex(green) + toHex(blue) + toHex(alpha, true);
};

// Convert rgb string (Ex: 'rgba(255, 255, 0, 1)') to rgba object (Ex: {r: 255, g: 255, b: 0, a: 1})
export const rgbStringToObject = (rgbString: string) => {
  const DEFAULT_ALPHA = 1;
  const [r, g, b] = rgbString
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);
  return { r, g, b, a: DEFAULT_ALPHA };
};

// Convert hex string (Ex: '#ffff00') to rgba object (Ex: {r: 255, g: 255, b: 0, a: 1})
export const hexToRGBA = (
  hexCode: string
): { r: number; g: number; b: number; a: number } => {
  const DEFAULT_ALPHA = 1;
  const hexWithoutHash = hexCode.replace("#", "");
  const r = parseInt(hexWithoutHash.substring(0, 2), 16);
  const g = parseInt(hexWithoutHash.substring(2, 4), 16);
  const b = parseInt(hexWithoutHash.substring(4, 6), 16);
  const a = DEFAULT_ALPHA;

  return { r, g, b, a };
};
