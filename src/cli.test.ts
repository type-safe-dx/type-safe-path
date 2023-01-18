import { expect, test } from "vitest";
import { execSync } from "child_process";

function runCli(arg: string): string {
  return execSync(`pnpm jiti src/cli.ts ${arg}`).toString();
}

test("cli help output should match snapshot", () => {
  const h = runCli("-h");
  const help = runCli("--help");
  expect(h).toEqual(help);
  expect(h).toMatchInlineSnapshot(`
    "
      Description
        Generate a path helper file from directory structure.

      Usage
        $ type-safe-path [options]

      Options
        -c, --config     config file path. e.g. tsp.config.ts
        -o, --output     output file path e.g. src/path.ts
        -v, --version    Displays current version
        -h, --help       Displays this message

    "
  `);
});
