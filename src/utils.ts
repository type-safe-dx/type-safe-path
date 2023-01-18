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
  return removeSuffix(removePathExtension(filePath), "index"); // posts/[id]/index.tsx => posts/[id]/index => posts/[id]
}

/**
 * @example
 * posts/[id]/index.tsx => posts/[id]/index
 */
export function removePathExtension(path: string): string {
  return path.replace(/\.\w+?$/, "");
}

/**
 * @example
 * removeSuffix('/posts/index', 'index') // => '/posts/'
 */
export function removeSuffix(str: string, suffix: string): string {
  return str.replace(new RegExp(`${suffix}$`), "");
}
