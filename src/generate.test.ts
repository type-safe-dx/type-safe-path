import { describe, expect, it, test } from "vitest";
import { defaultFilePathToRoutePath } from "./config/default";
import { generate } from "./generate";

const commonConfig = {
  routeDir: "pages",
  routesGlob: "**/*.{ts,tsx}",
  ignoreGlob: [],
  output: "src/$path.ts",
  filePathToRoutePath: defaultFilePathToRoutePath,
};

test("bracket", async () => {
  expect(
    await generate({ ...commonConfig, dynamicSegmentPattern: "bracket" }),
  ).toMatchInlineSnapshot(`
    "// prettier-ignore
    // This file is auto generated. DO NOT EDIT

    type PathToParams = {
      
    }

    /**
     * @example
     * buildPath('/posts/[id]', { id: 1 }) // => '/posts/1'
     */
    export function buildPath<Path extends keyof PathToParams>(
    path: Path,
    args: PathToParams[Path],
    ): string {
      return (
        path.replace(/\\\\[(\\\\w+)\\\\]/g, (_, key) => ((args as any).params)[key]) +
        (args.query
          ? '?' + new URLSearchParams(args.query as any).toString()
          : '') +
        (args.hash ? '#' + args.hash : '')
      )
    }

    /**
     * @example
     * echoPath('/posts/[id]') // => '/posts/[id]'
     */
    export function echoPath<Path extends keyof PathToParams>(path: Path): string {
      return path
    }
    "
  `);
});

it("colon", async () => {
  expect(
    await generate({ ...commonConfig, dynamicSegmentPattern: "bracket" }),
  ).toMatchInlineSnapshot(`
    "// prettier-ignore
    // This file is auto generated. DO NOT EDIT

    type PathToParams = {
      
    }

    /**
     * @example
     * buildPath('/posts/[id]', { id: 1 }) // => '/posts/1'
     */
    export function buildPath<Path extends keyof PathToParams>(
    path: Path,
    args: PathToParams[Path],
    ): string {
      return (
        path.replace(/\\\\[(\\\\w+)\\\\]/g, (_, key) => ((args as any).params)[key]) +
        (args.query
          ? '?' + new URLSearchParams(args.query as any).toString()
          : '') +
        (args.hash ? '#' + args.hash : '')
      )
    }

    /**
     * @example
     * echoPath('/posts/[id]') // => '/posts/[id]'
     */
    export function echoPath<Path extends keyof PathToParams>(path: Path): string {
      return path
    }
    "
  `);
});
