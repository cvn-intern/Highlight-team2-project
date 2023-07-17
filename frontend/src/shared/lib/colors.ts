export const rgbaToHex = (r: number, g: number, b: number, a: number) => {
  var r_hex = r.toString(16);
  var g_hex = g.toString(16);
  var b_hex = b.toString(16);
  var a_hex = Math.round(a * 255).toString(16);

  if (r_hex.length == 1) {
    r_hex = "0" + r_hex;
  }
  if (g_hex.length == 1) {
    g_hex = "0" + g_hex;
  }
  if (b_hex.length == 1) {
    b_hex = "0" + b_hex;
  }
  if (a_hex.length == 1) {
    a_hex = "0" + a_hex;
  }

  return "#" + r_hex + g_hex + b_hex + a_hex;
};

export const rgbStringToObject = (rgbString: string) => {
  const [r, g, b] = rgbString.replace(/[^\d,]/g, "").split(",");
  const rgbObject = {
    r: parseInt(r),
    g: parseInt(g),
    b: parseInt(b),
    a: 1,
  };
  return rgbObject;
};

export const hexToRGBA = (
  hexCode: string
): { r: number; g: number; b: number; a: number } => {
  hexCode = hexCode.replace("#", "");

  const r = parseInt(hexCode.substring(0, 2), 16);
  const g = parseInt(hexCode.substring(2, 4), 16);
  const b = parseInt(hexCode.substring(4, 6), 16);
  const a = 1;

  return {
    r,
    g,
    b,
    a,
  };
};
