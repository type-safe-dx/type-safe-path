import path from "path";
import { fileURLToPath } from "url";
import { generate } from "../src/generate";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setup() {
  process.chdir(path.resolve(dirname, "fixtures/bracket"));
  await generate({
    configFilePath: "./tsp.config",
    output: path.resolve(dirname, "./generated/bracket/output.ts"),
  });

  process.chdir(path.resolve(dirname, "fixtures/colon"));
  await generate({
    configFilePath: "./tsp.config",
    output: path.resolve(dirname, "./generated/colon/output.ts"),
  });
}
