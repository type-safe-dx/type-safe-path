# type-safe-path

[![codecov](https://codecov.io/gh/KoichiKiyokawa/type-safe-path/branch/main/graph/badge.svg?token=61F6FRPXKN)](https://codecov.io/gh/KoichiKiyokawa/type-safe-path)
[![npm version](https://badge.fury.io/js/@kiyoshiro%2Ftype-safe-path.svg)](https://badge.fury.io/js/@kiyoshiro%2Ftype-safe-path)

## Usage

```sh
npm i -D @kiyoshiro/type-safe-path
npx type-safe-path // generate a path helper file
```

## Features

- 🍃 Tiny runtime code
- 🚀 Zero config (Currently supports Next, Nuxt3 and SvelteKit)
- 🛠️️ Configurable for adapt any frameworks

## Abstract

```
pages/
  └── posts/
         ├──index.svelte
         └──[id].svelte
```

↓ `$ type-safe-path`

<details>
<summary>generated code</summary>

```ts
type PathToParams = {
  "/posts": {
    query?: Record<string, string | number | string[] | number[]>
    hash?: string
  }
  "/posts/[id]": {
    params: { id: string | number }
    query?: Record<string, string | number | string[] | number[]>
    hash?: string
  }
}

/**
 * @example
 * $path('/posts/[id]', { params: { id: 1 }}) // => '/posts/1'
 */
export function $path<Path extends keyof PathToParams>(
  path: Path,
  args: PathToParams[Path]
): string {
  return (
    path.replace(/\[(\w+)\]/g, (_, key) => (args as any).params[key]) +
    (args.query
      ? "?" + new URLSearchParams(args.query as any).toString()
      : "") +
    (args.hash ? "#" + args.hash : "")
  )
}

/**
 * @example
 * $echoPath('/posts/[id]') // => '/posts/[id]'
 */
export function $echoPath<Path extends keyof PathToParams>(path: Path): string {
  return path
}
```

</details>

https://user-images.githubusercontent.com/40315079/224537579-e3a28043-68cd-4a0a-bcfc-73df8113456d.mp4

## Comparison

|                                    | This library                                                                                                                                                                                              | [pathpida](https://github.com/aspida/pathpida)                      |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| API                                | <code>$path('posts/[id]', { params: { id: 1 }})</code>                                                                                                                                                    | <code>pagesPath.posts.\_id(1).$url()</code>                         |
| Bundle Size                        | Constant even if the number of paths increases, because it only generates few functions.                                                                                                                  | Increases as paths increase, because it generates a big object.     |
| For long path(e.g. `/foo/bar/baz`) | Just select one completion and we can search path like fuzzy<br><img width="564" alt="image" src="https://user-images.githubusercontent.com/40315079/213208755-c5f80f43-d59d-4a14-be76-da7316fb58bb.png"> | Needs to push `.` key many times for `pagesPath.foo.bar.baz.$url()` |
| Supported Frameworks               | Any frameworks (thanks to its flexible configuration)                                                                                                                                                     | Next.js, Nuxt.js                                                    |
