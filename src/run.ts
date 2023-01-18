import path from "path";
import fs from "fs";
import jiti from "jiti";
import { Config } from "./config";
import { createPathHelper } from "./core";
import glob from "tiny-glob/sync";

type Option = { configFilePath: string | undefined };

export function run({ configFilePath }: Option): void {
  const config: Config =
    configFilePath === undefined
      ? autoDetectConfig()
      : jiti(process.cwd(), {
          interopDefault: true,
          esmResolve: true,
        })(path.resolve("./tsp.config"));

  const pathList = glob(config.routesGlob, { cwd: config.routeDir });
  const ignorePathList =
    config.ignoreGlob === undefined ? [] : glob(config.ignoreGlob, { cwd: config.routeDir });

  createPathHelper(
    pathList.filter((p) => !ignorePathList.includes(p)),
    { dynamicSegmentPattern: config.dynamicSegmentPattern },
  );
}

function autoDetectConfig(): Config {
  if (fs.existsSync("next.config.js")) {
    // Next.js
    const routeDir = ["src/app", "src/pages", "app", "pages"].find((candidate) =>
      fs.existsSync(candidate),
    );
    if (routeDir === undefined) {
      throw Error("Cannot detect routeDir.\nThere are no src/app, src/pages, app or pages.");
    }

    const routesGlob = routeDir.endsWith("app")
      ? "**/page.{tsx,ts,jsx,js}"
      : "**/*.{tsx,ts,jsx,js}";
    return { routeDir, routesGlob, dynamicSegmentPattern: "bracket" };
  }

  if (fs.existsSync("svelte.config.js")) {
    // SvelteKit
    return {} as Config;
  }

  throw Error("Cannot detect any frameworks");
}
