const EXTENSIONS = ["svelte"].map((ext) => `.${ext}`)

/**
 *
 * @param paths e.g. posts/index.svelte 前後にスラッシュを入れてはいけない。
 * @returns
 */
export function createObjectString(paths: string[]): string {
  /**
   * About depth: e.g.
   * /posts is depth 0
   * /posts/edit is depth 1
   *
   * indexがdepthと対応している。
   * e.g. /posts, /users とパスが存在していれば [['posts', 'users']] となる
   */
  let depthToSegmentList: Segment[][] = []

  paths.forEach((path) => {
    const eachPathSegmentStrList = path
      .replace(new RegExp(EXTENSIONS.join("|")), "")
      .split("/")
    eachPathSegmentStrList.forEach((segmentStr, depth) => {
      depthToSegmentList[depth] ??= []
      // 同じdepthに同一のsegmentがあれば次のループへ
      if (
        depthToSegmentList[depth].some(
          (segment) => segment.value === segmentStr
        )
      )
        return

      const segment = segmentFactory(segmentStr)
      const parentSegment: Segment | undefined = depthToSegmentList[
        depth - 1
      ]?.find((seg) => seg.value === eachPathSegmentStrList[depth - 1])
      segment.parent = parentSegment
      parentSegment?.children.push(segment)
      depthToSegmentList[depth].push(segment)
    })
  })

  const $path = new StaticSegment({ value: "" })
  $path.children = depthToSegmentList[0]

  return "const $path =" + $path.toObjectString().slice(1) // :を削除する
}

function segmentFactory(segment: string): Segment {
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return new DynamicSegment({ value: segment.slice(1, -1) })
  } else {
    return new StaticSegment({ value: segment })
  }
}

/** StaticSegment, DynamicSegmentの基底クラス */
abstract class Segment {
  value: string // e.g. posts
  parent?: Segment
  children: Segment[]
  isTs: boolean = true

  constructor(args: { value: string; parent?: Segment; children?: Segment[] }) {
    this.value = args.value
    this.parent = args.parent
    this.children = args.children ?? []
  }

  abstract toObjectString(): string

  /** posts/[id]/editのedit部分であれば、editを返す。[id]部分であれば、${id}を返す */
  abstract toPath(): string

  getAbsolutePath(): string {
    if (this.value === "index") return this.parent?.getAbsolutePath() ?? ""
    if (this.parent == null) return this.toPath()
    return `${this.parent.getAbsolutePath()}/${this.toPath()}`
  }
}

/**
 * `posts/[id]/edit`の posts や edit など静的に決まる部分を表す
 */
class StaticSegment extends Segment {
  override toObjectString() {
    if (this.children.length === 0)
      return `${this.value}: \`${this.getAbsolutePath()}\``
    return `${this.value}: { ${this.children
      .map((child) => child.toObjectString())
      .join(", ")} }`
  }

  override toPath() {
    return this.value === "index" ? "" : this.value
  }
}

/**
 * `posts/[id]/edit`の [id]など動的に決まる部分を表す
 */
class DynamicSegment extends Segment {
  override toObjectString() {
    return `${this.value}: (${this.value}${this.isTs ? ": string" : ""}) => ${
      this.children.length === 0
        ? `\`${this.getAbsolutePath()}\``
        : `({ ${this.children
            .map((child) => child.toObjectString())
            .join(", ")} })`
    }`
  }

  override toPath() {
    return "${" + this.value + "}"
  }
}
