import { Config } from "./config";
import { defaultFilePathToRoutePath, normalizePath } from "./utils";

export function createPathHelper(
  pathList: string[],
  options: Pick<Config, "dynamicSegmentPattern" | "filePathToRoutePath">,
) {
  const dynamicSegmentRegex =
    options.dynamicSegmentPattern === "bracket"
      ? /\[(\w+)\]/
      : options.dynamicSegmentPattern === "colon"
      ? /:(\w+)/
      : options.dynamicSegmentPattern;

  const filePathToRoutePath = options.filePathToRoutePath || defaultFilePathToRoutePath;

  return `// prettier-ignore
// This file is auto generated. DO NOT EDIT

type PathToParams = {
  ${pathList
    .map((p) =>
      createTypeDefinitionRow(filePathToRoutePath(p), dynamicSegmentRegex, filePathToRoutePath),
    )
    .join(",\n  ")}
}

/**
 * @example
 * buildPath('posts/[id]', { id: 1 }) // => 'posts/1'
 */
export function buildPath<Path extends keyof PathToParams>(
  path: Path,
  ...params: PathToParams[Path] extends never
    ? [
        params?: {
          searchParams?: Record<string, string | number>
          hash?: string
        }
      ]
    : [
        params: PathToParams[Path] & {
          searchParams?: Record<string, string | number>
          hash?: string
        }
      ]
): string {
  const [pathParams] = params
  if (pathParams === undefined) return path

  return (
    path.replace(${new RegExp(dynamicSegmentRegex, "g")}, (_, key) => pathParams[key]) +
    (pathParams.searchParams
      ? '?' + new URLSearchParams(pathParams.searchParams as any).toString()
      : '') +
    (pathParams.hash ? '#' + pathParams.hash : '')
  )
}

/**
 * @example
 * echoPath('posts/[id]') // => 'posts/[id]'
 */
export function echoPath<Path extends keyof PathToParams>(path: Path): string {
  return path
}
`;
}

/**
 * @private
 * e.g. posts/[id]/index.tsx => '/posts/[id]: { id: string | number }
 * e.g. about.tsx => '/about': never
 */
function createTypeDefinitionRow(
  path: string,
  dynamicSegmentRegex: RegExp,
  filePathToRoutePath: (filePath: string) => string,
): string {
  const pathForKey = normalizePath(filePathToRoutePath(path));
  const params = path
    .split("/")
    .filter((p) => dynamicSegmentRegex.test(p))
    .map((m) => m.replace(dynamicSegmentRegex, "$1"));
  if (params.length === 0) return `'${pathForKey}': never`;

  return `'${pathForKey}': {${params.map((param) => `${param}: string | number`).join(", ")}}`;
}
