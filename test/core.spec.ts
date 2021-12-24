import { describe, it, expect } from 'vitest'
import { createPathObjectStringByPathList } from '../src/core'

describe.concurrent('only one file (ts)', () => {
  it('posts/index.svelte', () => {
    expect(createPathObjectStringByPathList(['posts/index.svelte'])).toEqual(
      'export const PATHS={posts:{index:`/posts`}}'
    )
  })

  it('posts/edit.svelte', () => {
    expect(createPathObjectStringByPathList(['posts/edit.svelte'])).toEqual(
      'export const PATHS={posts:{edit:`/posts/edit`}}'
    )
  })

  it('posts/[id]/index.svelte', () => {
    expect(
      createPathObjectStringByPathList(['posts/[id]/index.svelte'])
    ).toEqual(
      'export const PATHS={posts:{id:(id:string)=>({index:`/posts/${id}`})}}'
    )
  })

  it('posts/[id].svelte', () => {
    expect(createPathObjectStringByPathList(['posts/[id].svelte'])).toEqual(
      'export const PATHS={posts:{id:(id:string)=>`/posts/${id}`}}'
    )
  })

  it('posts/[id]/edit.svelte', () => {
    expect(
      createPathObjectStringByPathList(['posts/[id]/edit.svelte'])
    ).toEqual(
      'export const PATHS={posts:{id:(id:string)=>({edit:`/posts/${id}/edit`})}}'
    )
  })
})

describe.concurrent('base path', () => {
  it('multiple file (ts)', () => {
    expect(
      createPathObjectStringByPathList([
        'posts/index.svelte',
        'posts/[id]/index.svelte',
        'posts/[id]/edit.svelte',
      ])
    ).toEqual(
      'export const PATHS={posts:{index:`/posts`,id:(id:string)=>({index:`/posts/${id}`,edit:`/posts/${id}/edit`})}}'
    )
  })

  it('nested file (ts)', () => {
    expect(
      createPathObjectStringByPathList([
        'posts/[postId]/comments/[commentId]/index.svelte',
      ])
    ).toEqual(
      'export const PATHS={posts:{postId:(postId:string)=>({comments:{commentId:(commentId:string)=>({index:`/posts/${postId}/comments/${commentId}`})}})}}'
    )
  })
})
