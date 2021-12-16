import { createPathObjectStringByPathList } from "../src"

describe("only one file (ts)", () => {
  it("posts/index.svelte", () => {
    expect(createPathObjectStringByPathList(["posts/index.svelte"])).toEqual(
      `const $path = { posts: { index: \`/posts\` } }`
    )
  })

  it("posts/edit.svelte", () => {
    expect(createPathObjectStringByPathList(["posts/edit.svelte"])).toEqual(
      `const $path = { posts: { edit: \`/posts/edit\` } }`
    )
  })

  it("posts/[id]/index.svelte", () => {
    expect(
      createPathObjectStringByPathList(["posts/[id]/index.svelte"])
    ).toEqual(
      `const $path = { posts: { id: (id: string) => ({ index: \`/posts/\${id}\` }) } }`
    )
  })

  it("posts/[id].svelte", () => {
    expect(createPathObjectStringByPathList(["posts/[id].svelte"])).toEqual(
      `const $path = { posts: { id: (id: string) => \`/posts/\${id}\` } }`
    )
  })

  it("posts/[id]/edit.svelte", () => {
    expect(
      createPathObjectStringByPathList(["posts/[id]/edit.svelte"])
    ).toEqual(
      `const $path = { posts: { id: (id: string) => ({ edit: \`/posts/\${id}/edit\` }) } }`
    )
  })
})

describe("base path", () => {
  it("multiple file (ts)", () => {
    expect(
      createPathObjectStringByPathList([
        "posts/index.svelte",
        "posts/[id]/index.svelte",
        "posts/[id]/edit.svelte",
      ])
    ).toEqual(
      `const $path = { posts: { index: \`/posts\`, id: (id: string) => ({ index: \`/posts/\${id}\`, edit: \`/posts/\${id}/edit\` }) } }`
    )
  })
})
