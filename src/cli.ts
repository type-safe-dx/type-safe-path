#! /usr/bin/env node

import sade from "sade";
import { version } from "../package.json";
import kleur from "kleur";
import { autoDetectConfig } from "./config/detect";
import jiti from "jiti";
import path from "path";
import { Config } from "./config/type";
import fs from "fs";
import defu from "defu";
import { defaultFilePathToRoutePath } from "./config/default";

const loadTsConfig = (configPath: string) =>
  jiti(process.cwd(), { interopDefault: true, esmResolve: true })(configPath);

const prog = sade("type-safe-path", true);
prog
  .version(version)
  .describe("Generate a path helper file from directory structure.")
  .option("-c, --config", "config file path. e.g. tsp.config.ts")
  .option("-o, --output", "output file path e.g. src/path.ts")
  .option("-w, --watch", "watch the file changes and regenerate the path helper. e.g. src/**/*.tsx")
  .action(async (opts: { config?: string; output?: string; watch?: boolean }) => {
    try {
      const resolvedConfig = defu(
        { output: opts.output } as Required<Config>,
        loadTsConfig(path.resolve(process.cwd(), opts.config ?? "tsp.config.ts")),
        autoDetectConfig(),
        { filePathToRoutePath: defaultFilePathToRoutePath } as Config,
      );

      const { generate } = await import("./generate");
      const run = async () => {
        fs.writeFileSync(
          path.resolve(resolvedConfig.output ?? (fs.existsSync("src") ? "src/path.ts" : "path.ts")),
          await generate(resolvedConfig),
        );
      };

      if (opts.watch) {
        console.log(
          `Watching ${kleur.bold(
            kleur.green(
              (resolvedConfig.routeDir.endsWith("/")
                ? resolvedConfig.routeDir
                : `${resolvedConfig.routeDir}/`) + resolvedConfig.routesGlob,
            ),
          )}...`,
        );
        const chokidar = await import("chokidar");
        const watcher = chokidar.watch(resolvedConfig.routesGlob, {
          ignored: resolvedConfig.ignoreGlob,
          cwd: resolvedConfig.routeDir,
        });
        watcher.on("all", async (event, path) => {
          console.log(event, path);
          await run();
          console.log(kleur.green("Regenerated path helper"));
        });
      } else {
        await run();
        console.log(
          `Path helper has been generated to ${kleur.bold(kleur.green(resolvedConfig.output))}`,
        );
      }
    } catch (e) {
      console.log(kleur.red((e as Error).message));
    }
  });

prog.parse(process.argv);
