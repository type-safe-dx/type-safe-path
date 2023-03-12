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

/**
 * @example
 * posts/[id]/index.tsx => posts/[id]/index
 */
export function removePathExtension(path: string): string {
  return path.replace(/\.\w+?$/, "");
}

/**
 * @example
 * removePrefix('pages/posts/index', 'pages') // => '/posts/index'
 */
export function removePrefix(str: string, prefix: string): string {
  return str.replace(new RegExp(`^${prefix}`), "");
}

/**
 * @example
 * removeSuffix('/posts/index', 'index') // => '/posts/'
 */
export function removeSuffix(str: string, suffix: string): string {
  return str.replace(new RegExp(`${suffix}$`), "");
}
