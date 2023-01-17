import { expect, test } from 'vitest'
import { buildPath, rawPath } from './output'

test('build path with params, query, hash', () => {
  expect(
    buildPath('posts/[id]/comments/[commentId]', {
      id: 1,
      commentId: 2,
      searchParams: { q: 1 },
      hash: 'section',
    }),
  ).toBe('posts/1/comments/2?q=1#section')
})

test('rawPath should returns the argument', () => {
  expect(rawPath('posts/[id]/comments/[commentId]')).toBe('posts/[id]/comments/[commentId]')
})
