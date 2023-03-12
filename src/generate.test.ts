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

    type IsAllPropertiesOptional<T> = { [K in keyof T]?: any } extends T ? true : false

    type PathToParams = {
      
    }

    /**
     * @example
     * $path('/posts/[id]', { params: { id: 1 } }) // => '/posts/1'
     */
    export function $path<Path extends keyof PathToParams>(
      path: Path,
      ...args: IsAllPropertiesOptional<PathToParams[Path]> extends true ? [p?: PathToParams[Path]] : [p: PathToParams[Path]]
    ): string {
      const { params, query, hash } = (args[0] ?? {} as any)
      return (
        (params ? path.replace(/\\\\[(\\\\w+)\\\\]/g, (_, key) => params[key]) : path) +
        (query
          ? '?' + new URLSearchParams(query as any).toString()
          : '') +
        (hash ? '#' + hash : '')
      )
    }

    /**
     * @example
     * $echoPath('/posts/[id]') // => '/posts/[id]'
     */
    export function $echoPath<Path extends keyof PathToParams>(path: Path): string {
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

    type IsAllPropertiesOptional<T> = { [K in keyof T]?: any } extends T ? true : false

    type PathToParams = {
      
    }

    /**
     * @example
     * $path('/posts/[id]', { params: { id: 1 } }) // => '/posts/1'
     */
    export function $path<Path extends keyof PathToParams>(
      path: Path,
      ...args: IsAllPropertiesOptional<PathToParams[Path]> extends true ? [p?: PathToParams[Path]] : [p: PathToParams[Path]]
    ): string {
      const { params, query, hash } = (args[0] ?? {} as any)
      return (
        (params ? path.replace(/\\\\[(\\\\w+)\\\\]/g, (_, key) => params[key]) : path) +
        (query
          ? '?' + new URLSearchParams(query as any).toString()
          : '') +
        (hash ? '#' + hash : '')
      )
    }

    /**
     * @example
     * $echoPath('/posts/[id]') // => '/posts/[id]'
     */
    export function $echoPath<Path extends keyof PathToParams>(path: Path): string {
      return path
    }
    "
  `);
});
