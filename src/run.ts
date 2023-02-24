import path from "path";
import fs from "fs";
import jiti from "jiti";
import { Config } from "./config";
import { createPathHelper } from "./core";
import glob from "tiny-glob";
import { defaultFilePathToRoutePath, removePathExtension, removeSuffix } from "./utils";
import kleur from "kleur";
import chokidar from "chokidar";

type Option = { configFilePath: string | undefined; output?: string; watch: boolean };

export async function run({ configFilePath, output, watch }: Option): Promise<void> {
  const config: Config =
    configFilePath === undefined
      ? autoDetectConfig()
      : jiti(process.cwd(), {
          interopDefault: true,
          esmResolve: true,
        })(path.resolve("./tsp.config"));

  const pathList = await glob(config.routesGlob, { cwd: config.routeDir });
  const ignorePathList =
    config.ignoreGlob === undefined ? [] : await glob(config.ignoreGlob, { cwd: config.routeDir });

  const outputFilePath =
    output ?? config.output ?? fs.existsSync("src") ? "src/path.ts" : "path.ts";

  const generate = () => {
    const pathHelper = createPathHelper(
      pathList.filter((p) => !ignorePathList.includes(p)),
      { dynamicSegmentPattern: config.dynamicSegmentPattern },
    );
    fs.writeFileSync(outputFilePath, pathHelper, "utf-8");
  };

  if (watch) {
    console.log(
      `Watching ${kleur.bold(
        kleur.green(
          (config.routeDir.endsWith("/") ? config.routeDir : `${config.routeDir}/`) +
            config.routesGlob,
        ),
      )}...`,
    );
    const watcher = chokidar.watch(config.routesGlob, {
      ignored: config.ignoreGlob,
      cwd: config.routeDir,
    });
    watcher.on("all", (event, path) => {
      console.log(event, path);
      generate();
      console.log(kleur.green("Regenerated path helper"));
    });
  } else {
    generate();
    console.log(`Path helper has been generated to ${kleur.bold(kleur.green(outputFilePath))}`);
  }
}

function showDetectedResult(framework: string) {
  console.log(`Detected framework: ${kleur.green(framework)}`);
}

function autoDetectConfig(): Config {
  console.log("Config file path is not specified, so we will auto detect the config");
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

    const filePathToRoutePath = isAppDir
      ? (f: string) => removeSuffix(removePathExtension(f), "page")
      : defaultFilePathToRoutePath;
    return {
      routeDir,
      routesGlob,
      ignoreGlob: "{_app,_document}.{tsx,ts,jsx,js}",
      dynamicSegmentPattern: "bracket",
      filePathToRoutePath,
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
      dynamicSegmentPattern: "bracket",
      filePathToRoutePath: (f: string) => removeSuffix(removePathExtension(f), "index"),
    };
  }

  if (fs.existsSync("svelte.config.js")) {
    // SvelteKit
    showDetectedResult("SvelteKit");
    return {
      routeDir: "src/routes",
      routesGlob: "src/routes/**/+page.svelte",
      dynamicSegmentPattern: "bracket",
      filePathToRoutePath: (f: string) => removeSuffix(f, "+page.svelte"),
    } as Config;
  }

  throw Error("Cannot detect any frameworks");
}
