/**
 * @example
 * `posts/[id]` => `/posts/[id]`
 * `/posts/[id]/` => `/posts/[id]`
 * `` => `/`
 */
export function normalizePath(path: string) {
  if (path === "") return "/";
  path = path.startsWith("/") ? path : `/${path}`;
  path = path.endsWith("/") ? path.slice(0, -1) : path;
  return path;
}

export function defaultFilePathToRoutePath(filePath: string) {
  return filePath
    .replace(/\.\w+?$/, "") // posts/[id]/index.tsx => posts/[id]/index
    .replace(/index$/, ""); // posts/[id]/index => posts/[id]/
}
