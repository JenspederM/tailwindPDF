import tailwindColors from "tailwindcss/colors";

export type rgbIntensity = [number, number, number];

export const rem2px = (rem: string) => {
  let _px;
  if (typeof rem === "string") {
    if (rem.endsWith("rem")) {
      _px = rem.slice(0, -3).replaceAll(" ", "").replaceAll(",", ".");
    } else {
      _px = rem.replaceAll(" ", "").replaceAll(",", ".");
    }
  } else {
    _px = rem;
  }
  return parseFloat(_px) * 16;
};

export function getColorIntesity(color: string): rgbIntensity {
  const twColor = _getTailwindColor(color);
  const intensity = _hexToIntensity(twColor);
  console.debug(
    `Color intensity for '${color}' = [${intensity}]`,
    "_getColorIntesity"
  );
  return intensity;
}

function _getTailwindColor(color: string, defaultIntensity = 400): string {
  const [name, intensity] = color.split("-");
  const colorName = name || "white";

  try {
    const color = tailwindColors[colorName as keyof typeof tailwindColors];

    if (typeof color === "string") {
      return color;
    }

    if (color) {
      const colorIntensity = intensity || defaultIntensity;
      return color[colorIntensity as keyof typeof color];
    }

    console.trace(`Getting tailwind color '${color}'`, "_getTailwindColor");

    throw new Error(`Color '${colorName}' not found`);
  } catch (e) {
    console.error(e);
    return "#ffffff";
  }
}

export function _hexToIntensity(hex: string): rgbIntensity {
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  if (hex.length !== 6) {
    throw new Error("Only six-digit hex colors are allowed.");
  }

  const rgbHex = hex.match(/.{1,2}/g);
  if (rgbHex === null) {
    throw new Error("Invalid hex color");
  }

  const rbg = [
    parseInt(rgbHex[0], 16),
    parseInt(rgbHex[1], 16),
    parseInt(rgbHex[2], 16),
  ];

  const rgbIntensity: rgbIntensity = [rbg[0] / 255, rbg[1] / 255, rbg[2] / 255];

  console.trace(
    `Getting hex to intensity for '#${hex}' = [${rgbIntensity}]`,
    "_hexToIntensity"
  );

  return rgbIntensity;
}
