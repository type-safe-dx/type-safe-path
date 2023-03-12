import { defineConfig } from "../../../src";

export default defineConfig({
  routeDir: "pages",
  routesGlob: "**/*.{tsx,ts,jsx,js}",
  dynamicSegmentPattern: "bracket",
});
