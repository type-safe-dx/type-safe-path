import { execSync } from "node:child_process";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setup() {
  process.chdir(path.resolve(dirname, "./fixtures/bracket"));

  execSync(
    `pnpm jiti ${path.resolve(dirname, "../src/cli.ts")} -o ${path.resolve(
      dirname,
      "./generated/bracket/output.ts",
    )}`,
    { stdio: "inherit" },
  );

  process.chdir(path.resolve(dirname, "./fixtures/colon"));
  execSync(
    `pnpm jiti ${path.resolve(dirname, "../src/cli.ts")} -o ${path.resolve(
      dirname,
      "./generated/colon/output.ts",
    )}`,
  );
}
