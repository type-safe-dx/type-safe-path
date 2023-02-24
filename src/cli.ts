#! /usr/bin/env node

import sade from "sade";
import { version } from "../package.json";
import kleur from "kleur";

const prog = sade("type-safe-path", true);
prog
  .version(version)
  .describe("Generate a path helper file from directory structure.")
  .option("-c, --config", "config file path. e.g. tsp.config.ts")
  .option("-o, --output", "output file path e.g. src/path.ts")
  .option("-w, --watch", "watch the file changes and regenerate the path helper. e.g. src/**/*.tsx")
  .action(async (opts: { config: string; output: string; watch: boolean }) => {
    try {
      const { run } = await import("./run");
      await run({ configFilePath: opts.config, output: opts.output, watch: opts.watch });
    } catch (e) {
      console.log(kleur.red((e as Error).message));
    }
  });

prog.parse(process.argv);
