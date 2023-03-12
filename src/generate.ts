import glob from "fast-glob";
import { Config } from "./config/type";
import { extractQueryType } from "./query";
import { normalizePath } from "./utils";
import fs from "fs/promises";
import path from "path";

type Option = Required<Config> & { watch?: boolean };

export async function generate({
  routeDir,
  routesGlob,
  ignoreGlob,
  dynamicSegmentPattern,
  filePathToRoutePath,
  output,
}: Option): Promise<string> {
  const pathList = await glob(routesGlob, { cwd: routeDir });
  const ignorePathList = ignoreGlob === undefined ? [] : await glob(ignoreGlob, { cwd: routeDir });

  const dynamicSegmentRegex =
    dynamicSegmentPattern === "bracket"
      ? /\[(\w+)\]/
      : dynamicSegmentPattern === "colon"
      ? /:(\w+)/
      : dynamicSegmentPattern;

  /**
   * @private
   * e.g. posts/[id]/index.tsx => '/posts/[id]: { params: { id: string | number }; query: ... }
   * e.g. about.tsx => '/about': { query?: ... }
   */
  async function createTypeDefinitionRow(filePath: string): Promise<string> {
    const routePath = filePathToRoutePath({ filePath, routeDir });

    const params = routePath
      .split("/")
      .filter((p) => dynamicSegmentRegex.test(p))
      .map((m) => m.replace(dynamicSegmentRegex, "$1"));

    const paramsTypeDef =
      params.length === 0
        ? null
        : `params: { ${params.map((param) => `${param}: string | number`).join("; ")} }`;

    const routeFileAbsolutePath = path.resolve(routeDir, filePath);
    const query = await extractQueryType({
      routeFileAbsolutePath,
      source: await fs.readFile(routeFileAbsolutePath, "utf-8"),
      outputAbsolutePath: path.resolve(output),
    });
    const queryTypeDef = query
      ? `query: ${query}`
      : "query?: Record<string, string | number | string[] | number[]>";

    const hashTypeDef = "hash?: string";

    const pathForKey = normalizePath(routePath);
    return `'${pathForKey}': { ${[paramsTypeDef, queryTypeDef, hashTypeDef]
      .filter(Boolean)
      .join(";")} }`;
  }

  return `// prettier-ignore
// This file is auto generated. DO NOT EDIT

type PathToParams = {
  ${(
    await Promise.all(
      pathList.filter((p) => !ignorePathList.includes(p)).map((p) => createTypeDefinitionRow(p)),
    )
  ).join(",\n  ")}
}

/**
 * @example
 * $path('/posts/[id]', { params: { id: 1 } }) // => '/posts/1'
 */
export function $path<Path extends keyof PathToParams>(
  path: Path,
  args: PathToParams[Path],
): string {
  return (
    path.replace(${new RegExp(dynamicSegmentRegex, "g")}, (_, key) => ((args as any).params)[key]) +
    (args.query
      ? '?' + new URLSearchParams(args.query as any).toString()
      : '') +
    (args.hash ? '#' + args.hash : '')
  )
}

/**
 * @example
 * $echoPath('/posts/[id]') // => '/posts/[id]'
 */
export function $echoPath<Path extends keyof PathToParams>(path: Path): string {
  return path
}
`;
}
