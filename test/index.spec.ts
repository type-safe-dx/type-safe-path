import { createObjectString } from "../src"

describe("only one file (ts)", () => {
  it("posts/index.svelte", () => {
    expect(createObjectString(["posts/index.svelte"])).toEqual(
      `const $path = { posts: { index: \`/posts\` } }`
    )
  })

  it("posts/edit.svelte", () => {
    expect(createObjectString(["posts/edit.svelte"])).toEqual(
      `const $path = { posts: { edit: \`/posts/edit\` } }`
    )
  })

  it("posts/[id]/index.svelte", () => {
    expect(createObjectString(["posts/[id]/index.svelte"])).toEqual(
      `const $path = { posts: { id: (id: string) => ({ index: \`/posts/\${id}\` }) } }`
    )
  })

  it("posts/[id].svelte", () => {
    expect(createObjectString(["posts/[id].svelte"])).toEqual(
      `const $path = { posts: { id: (id: string) => \`/posts/\${id}\` } }`
    )
  })

  it("posts/[id]/edit.svelte", () => {
    expect(createObjectString(["posts/[id]/edit.svelte"])).toEqual(
      `const $path = { posts: { id: (id: string) => ({ edit: \`/posts/\${id}/edit\` }) } }`
    )
  })
})

describe("base path", () => {
  it("multiple file (ts)", () => {
    expect(
      createObjectString([
        "posts/index.svelte",
        "posts/[id]/index.svelte",
        "posts/[id]/edit.svelte",
      ])
    ).toEqual(
      `const $path = { posts: { index: \`/posts\`, id: (id: string) => ({ index: \`/posts/\${id}\`, edit: \`/posts/\${id}/edit\` }) } }`
    )
  })
})
