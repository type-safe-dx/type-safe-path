// prettier-ignore
// This file is auto generated. DO NOT EDIT

type IsAllPropertiesOptional<T> = { [K in keyof T]?: any } extends T ? true : false;

type PathToParams = {
  "/about": { query: import("../../projects/bracket/pages/about").Query; hash?: string };
  "/posts": { query?: Record<string, string | number | string[] | number[]>; hash?: string };
  "/posts/[id]/comments/[commentId]": {
    params: { id: string | number; commentId: string | number };
    query?: Record<string, string | number | string[] | number[]>;
    hash?: string;
  };
};

/**
 * @example
 * $path('/posts/[id]', { params: { id: 1 } }) // => '/posts/1'
 */
export function $path<Path extends keyof PathToParams>(
  path: Path,
  ...args: IsAllPropertiesOptional<PathToParams[Path]> extends true
    ? [p?: PathToParams[Path]]
    : [p: PathToParams[Path]]
): string {
  const { params, query, hash } = args[0] ?? ({} as any);
  return (
    (params ? path.replace(/\[(\w+)\]/g, (_, key) => params[key]) : path) +
    (query ? "?" + new URLSearchParams(query as any).toString() : "") +
    (hash ? "#" + hash : "")
  );
}

/**
 * @example
 * $echoPath('/posts/[id]') // => '/posts/[id]'
 */
export function $echoPath<Path extends keyof PathToParams>(path: Path): string {
  return path;
}
