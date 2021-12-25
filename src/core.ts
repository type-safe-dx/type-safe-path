import { deepMerge, ArrowFunction } from './utils'
const EXTENSIONS = ['svelte'].map((ext) => `.${ext}`)

/**
 * @param pathList e.g. posts/index.svelte
 * @returns const PATHS = { posts: { index: `/posts` } }
 */
export function createPathObjectStringByPathList(pathList: string[]): string {
  let pathObject: Record<string, any> = {}
  pathList.forEach((path) => {
    if (path.startsWith('/')) path = path.slice(1)
    let current: any =
      '`/' +
      omitExtensions(path)
        .replace(/\[(\w+)\]/g, '${$1}')
        .replace(/\/index$/, '') +
      '`'

    const segments = path.split('/')
    segments.reverse().forEach((segment) => {
      if (isDynamicSegment(omitExtensions(segment))) {
        const param = omitExtensions(segment).slice(1, -1)
        current = { [param]: new ArrowFunction(param, current) }
      } else {
        current = { [omitExtensions(segment)]: current }
      }
    })
    pathObject = deepMerge(pathObject, current)
  })

  // remove double quotes in JSON to make valid JavaScript/TypeScript code.
  return 'export const PATHS=' + JSON.stringify(pathObject).replace(/"/g, '')
}

/** @private */
function omitExtensions(str: string) {
  return str.replace(new RegExp(EXTENSIONS.join('|')), '')
}

/** @private */
function isDynamicSegment(segment: string) {
  return /^\[\w+\]$/.test(segment)
}
