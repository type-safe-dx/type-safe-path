import { deepMerge, ArrowFunction } from "./utils"
const EXTENSIONS = ["svelte"].map((ext) => `.${ext}`)

/**
 * @param pathList e.g. posts/index.svelte 前後にスラッシュを入れてはいけない。
 * @returns const $path = { posts: { index: `/posts` } }
 */
export function createPathObjectStringByPathList(pathList: string[]): string {
  let pathObject: Record<string, any> = {}
  pathList.forEach((path) => {
    if (path.startsWith("/")) path = path.slice(1)
    let current: any =
      "`" + omitExtensions(path).replace(/\[(\w+)\]/, "${$1}") + "`"

    const segments = path.split("/")
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

  return (
    "export const $path = " +
    JSON.stringify(pathObject, null, 2).replace(/"|\\/g, "")
  )
}

/** @private */
function omitExtensions(str: string) {
  return str.replace(new RegExp(EXTENSIONS.join("|")), "")
}

/** @private */
function isDynamicSegment(segment: string) {
  return /^\[\w+\]$/.test(segment)
}

console.log(
  createPathObjectStringByPathList(["posts/index.svelte", "posts/[id].svelte"])
)
