# type-safe-path

```
pages/
  └── posts/
         ├──index.svelte
         └──[id].svelte
```

↓ `tsp "src/pages/**" -o src/paths.ts`

```ts
// src/path.ts
export const PATHS = {
  posts: {
    index: `/posts`,
    id: (id: string) => `/posts/${id}`
  }
}

// usage
<a href={PATHS.posts.id(123)}>post detail</a>
```

## TODO

- [x] Make it configurable (enough to adapt any frameworks, such as Next, Nuxt, SvelteKit, etc.)
- [ ] Increase coverage
- [ ] Implement cli
- [ ] Documentation

This library is inspired by https://github.com/aspida/pathpida
