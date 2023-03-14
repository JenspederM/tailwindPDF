import resolveConfig from "tailwindcss/resolveConfig";
import { Config } from "tailwindcss/types";
const tailwindConfig = require("./tailwind.config");

const config = resolveConfig<Config>(tailwindConfig);
const theme = config.theme;

export default theme;
