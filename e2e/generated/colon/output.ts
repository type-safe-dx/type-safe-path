// prettier-ignore
// This file is auto generated. DO NOT EDIT

type PathToParams = {
  "/about": { query?: Record<string, string | number | string[] | number[]>; hash?: string };
  "/posts/:id/comments/:commentId": {
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
  args: PathToParams[Path],
): string {
  return (
    path.replace(/:(\w+)/g, (_, key) => (args as any).params[key]) +
    (args.query ? "?" + new URLSearchParams(args.query as any).toString() : "") +
    (args.hash ? "#" + args.hash : "")
  );
}

/**
 * @example
 * $echoPath('/posts/[id]') // => '/posts/[id]'
 */
export function $echoPath<Path extends keyof PathToParams>(path: Path): string {
  return path;
}
