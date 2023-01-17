import { Config } from './config'

export function createPathHelperFromPathList(
  pathList: string[],
  options: { dynamicSegmentPattern: Config['dynamicSegmentPattern'] }
) {
  const dynamicSegmentRegex =
    options.dynamicSegmentPattern === 'bracket'
      ? /\[(\w+)\]/
      : options.dynamicSegmentPattern === 'colon'
      ? /:(\w+)/
      : options.dynamicSegmentPattern

  return `// prettier-ignore
// This file is auto generated. DO NOT EDIT

type PathToParams = {
  ${pathList
    .map((p) => createTypeDefinitionRow(filePathToUrlPath(p), dynamicSegmentRegex))
    .join(',\n\t')}
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
    path.replace(${new RegExp(dynamicSegmentRegex, 'g')}, (_, key) => pathParams[key]) +
    (pathParams.searchParams
      ? '?' + new URLSearchParams(pathParams.searchParams as any).toString()
      : '') +
    (pathParams.hash ? '#' + pathParams.hash : '')
  )
}

/**
 * @example
 * rawPath('posts/[id]') // => 'posts/[id]'
 */
export function rawPath<Path extends keyof PathToParams>(path: Path): string {
  return path
}
`
}

/** @private  */
function filePathToUrlPath(filePath: string) {
  return filePath
    .replace(/\.\w+?$/, '') // posts/[id]/index.tsx => posts/[id]/index
    .replace('/index', '') // posts/[id]/index => posts/[id]
    .replace('index', '/') // index => /
}

/**
 * @private
 * e.g. posts/[id]/index.tsx => 'posts/[id]: { id: string | number }
 * e.g. about.tsx => 'about': never
 */
function createTypeDefinitionRow(path: string, dynamicSegmentRegex: RegExp): string {
  const pathForKey = filePathToUrlPath(path)
  const params = path
    .split('/')
    .filter((p) => dynamicSegmentRegex.test(p))
    .map((m) => m.replace(dynamicSegmentRegex, '$1'))
  if (params.length === 0) return `${pathForKey}: never`

  return `'${pathForKey}': {${params.map((param) => `${param}: string | number`).join(', ')}}`
}
