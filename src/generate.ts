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
    const pathForKey = normalizePath(routePath);
    const params = routePath
      .split("/")
      .filter((p) => dynamicSegmentRegex.test(p))
      .map((m) => m.replace(dynamicSegmentRegex, "$1"));
    if (params.length === 0) return `'${pathForKey}': never`;

    const resolvedFilePath = path.resolve(routeDir, filePath);
    const query = await extractQueryType({
      filePath: resolvedFilePath,
      source: await fs.readFile(resolvedFilePath, "utf-8"),
      routeDir: routeDir,
      outputPath: output,
    });
    const queryTypeDef = query
      ? `query: ${query}`
      : "query?: Record<string, string | number | string[] | number[]>";

    return `'${pathForKey}': { params: { ${params
      .map((param) => `${param}: string | number`)
      .join("; ")} }; ${queryTypeDef}; hash?: string }`;
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
* buildPath('/posts/[id]', { id: 1 }) // => '/posts/1'
*/
export function buildPath<Path extends keyof PathToParams>(
path: Path,
args: PathToParams[Path],
): string {
return (
  path.replace(${new RegExp(dynamicSegmentRegex, "g")}, (_, key) => (args.params as any)[key]) +
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
`;
}
