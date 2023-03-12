import { Config } from "./type";
import fs from "fs";
import kleur from "kleur";
import { removePathExtension, removeSuffix } from "../utils";
import { defaultFilePathToRoutePath } from "./default";

export function autoDetectConfig(): Partial<Omit<Config, "output">> {
  if (fs.existsSync("next.config.js")) {
    // Next.js
    showDetectedResult("Next.js");
    const routeDir = ["src/app", "src/pages", "app", "pages"].find((candidate) =>
      fs.existsSync(candidate),
    );
    if (routeDir === undefined) {
      throw Error("Cannot detect routeDir.\nThere are no src/app, src/pages, app or pages.");
    }

    const isAppDir = routeDir.endsWith("app");

    const routesGlob = isAppDir ? "**/page.{tsx,ts,jsx,js}" : "**/*.{tsx,ts,jsx,js}";

    return {
      routeDir,
      routesGlob,
      ignoreGlob: "{_app,_document}.{tsx,ts,jsx,js}",
      dynamicSegmentPattern: "bracket",
      filePathToRoutePath: isAppDir
        ? ({ filePath }) => removeSuffix(removePathExtension(filePath), "page")
        : defaultFilePathToRoutePath,
    };
  }

  if (["nuxt.config.ts", "nuxt.config.js"].some((c) => fs.existsSync(c))) {
    // Nuxt3
    showDetectedResult("Nuxt.js v3");
    const routeDir = ["pages", "src/pages"].find((candidate) => fs.existsSync(candidate));
    if (routeDir === undefined) {
      throw Error("Cannot detect routeDir.\nThere are no src/app, src/pages, app or pages.");
    }

    return {
      routeDir,
      routesGlob: "**/*.vue",
      ignoreGlob: [],
      dynamicSegmentPattern: "bracket",
      filePathToRoutePath: ({ filePath }) => removeSuffix(removePathExtension(filePath), "index"),
    };
  }

  if (fs.existsSync("svelte.config.js")) {
    // SvelteKit
    showDetectedResult("SvelteKit");
    return {
      routeDir: "src/routes",
      routesGlob: "src/routes/**/+page.svelte",
      ignoreGlob: [],
      dynamicSegmentPattern: "bracket",
      filePathToRoutePath: ({ filePath }) => removeSuffix(filePath, "+page.svelte"),
    };
  }

  return {};
}

function showDetectedResult(framework: string) {
  console.log(`Detected framework: ${kleur.green(framework)}`);
}
