# type-safe-path

[![codecov](https://codecov.io/gh/KoichiKiyokawa/type-safe-path/branch/main/graph/badge.svg?token=61F6FRPXKN)](https://codecov.io/gh/KoichiKiyokawa/type-safe-path)

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

```ts
type PathToParams = {
  posts: never
  "posts/[id]": { id: string | number }
}

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
    path.replace(/\[(\w+)\]/g, (_, key) => pathParams[key]) +
    (pathParams.searchParams
      ? "?" + new URLSearchParams(pathParams.searchParams as any).toString()
      : "") +
    (pathParams.hash ? "#" + pathParams.hash : "")
  )
}
```

https://user-images.githubusercontent.com/40315079/212696306-ed6c9f88-4641-4549-b539-f56fba4814d1.mp4

## Comparison

|                                    | This library                                                                                                                                                                                              | [pathpida](https://github.com/aspida/pathpida)                      |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| API                                | <code>buildPath('posts/[id]', {id:1})</code>                                                                                                                                                              | <code>pagesPath.posts.\_id(1).$url()</code>                         |
| Bundle Size                        | Constant even if the number of paths increases, because it only generates few functions.                                                                                                                  | Increases as paths increase, because it generates a big object.     |
| For long path(e.g. `/foo/bar/baz`) | Just select one completion and we can search path like fuzzy<br><img width="564" alt="image" src="https://user-images.githubusercontent.com/40315079/213208755-c5f80f43-d59d-4a14-be76-da7316fb58bb.png"> | Needs to push `.` key many times for `pagesPath.foo.bar.baz.$url()` |
| Supported Frameworks               | Any frameworks (thanks to its flexible configuration)                                                                                                                                                     | Next.js, Nuxt.js                                                    |
