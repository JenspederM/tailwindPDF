import { jsPDFOptions } from "jspdf";

export const DEFAULT_PDF_OPTIONS: jsPDFOptions = {
  orientation: "portrait",
  unit: "pt",
  format: "a4",
  putOnlyUsedFonts: true,
  compress: false,
  precision: 16,
  userUnit: 1.0,
  hotfixes: ["px_scaling"],
  encryption: {},
  floatPrecision: 16,
};
