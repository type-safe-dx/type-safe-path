import { Config, defaultConfig } from './config'
import { deepMerge, ArrowFunction } from './utils'

/**
 * @param pathList e.g. posts/index.svelte
 * @param config
 * @returns const PATHS = { posts: { index: `/posts` } }
 */
export function createPathObjectStringByPathList(
  pathList: string[],
  config: Config = defaultConfig
): string {
  let pathObject: Record<string, any> = {}
  pathList.forEach((path) => {
    if (path.startsWith('/')) path = path.slice(1)

    const segments = path.split('/')
    if (
      segments.some((segment) => new RegExp(config.ignorePattern).test(segment))
    ) {
      return
    }

    let current: any =
      '`/' +
      omitExtension(path)
        .replace(/\[(\w+)\]/g, '${$1}')
        .replace(/\/index$/, '') +
      '`'

    segments.reverse().forEach((segment) => {
      if (isDynamicSegment(omitExtension(segment))) {
        const param = omitExtension(segment).slice(1, -1)
        current = { [param]: new ArrowFunction(param, current) }
      } else {
        current = { [omitExtension(segment)]: current }
      }
    })
    pathObject = deepMerge(pathObject, current)
  })

  // remove double quotes in JSON to make valid JavaScript/TypeScript code.
  return 'export const PATHS=' + JSON.stringify(pathObject).replace(/"/g, '')
}

/** @private */
function omitExtension(str: string) {
  if (!str.includes('.')) return str
  return str.replace(/(.*)\..*/, '$1')
}

/** @private */
function isDynamicSegment(segment: string) {
  return /^\[\w+\]$/.test(segment)
}
