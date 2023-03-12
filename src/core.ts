import { Config } from "./config";
import { extractQueryType } from "./query";
import { defaultFilePathToRoutePath, normalizePath, removePrefix } from "./utils";

export async function createPathHelper(
  /** relative path from cwd */
  pathList: string[],
  options: {
    routeDir: string;
    output: string;
    dynamicSegmentPattern: string;
    filePathToRoutePath: ((filePath: string) => string) | undefined;
  },
) {
  const dynamicSegmentRegex =
    options.dynamicSegmentPattern === "bracket"
      ? /\[(\w+)\]/
      : options.dynamicSegmentPattern === "colon"
      ? /:(\w+)/
      : options.dynamicSegmentPattern;

  const filePathToRoutePath = options.filePathToRoutePath || defaultFilePathToRoutePath;

  /**
   * @private
   * e.g. posts/[id]/index.tsx => '/posts/[id]: { params: { id: string | number }; query: ... }
   * e.g. about.tsx => '/about': { query?: ... }
   */
  async function createTypeDefinitionRow(filePath: string): Promise<string> {
    const pathForKey = normalizePath(filePathToRoutePath(removePrefix(filePath, options.routeDir)));
    const params = filePathToRoutePath(filePath)
      .split("/")
      .filter((p) => dynamicSegmentRegex.test(p))
      .map((m) => m.replace(dynamicSegmentRegex, "$1"));
    if (params.length === 0) return `'${pathForKey}': never`;

    const query = await extractQueryType({
      filePath,
      routeDir: options.routeDir,
      outputPath: options.output,
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
  ${(await Promise.all(pathList.map((p) => createTypeDefinitionRow(p)))).join(",\n  ")}
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
