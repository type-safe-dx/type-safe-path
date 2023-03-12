import { defineConfig } from "../../../src";

export default defineConfig({
  routeDir: "pages",
  routesGlob: "**/*.vue",
  dynamicSegmentPattern: "colon",
});
