/* eslint-disable @typescript-eslint/ban-ts-comment */
import { test, assertType } from 'vitest'
import { buildPath } from './output'

test('valid', () => {
  assertType(
    buildPath('posts/[id]/comments/[commentId]', { id: 1, commentId: 1 })
  )
  assertType(
    buildPath('posts/[id]/comments/[commentId]', {
      id: 1,
      commentId: 1,
      searchParams: { q: 'foo' },
    })
  )
  assertType(
    buildPath('posts/[id]/comments/[commentId]', {
      id: 1,
      commentId: 1,
      hash: 'section',
    })
  )
  assertType(
    buildPath('posts/[id]/comments/[commentId]', {
      id: 1,
      commentId: 1,
      searchParams: { q: 1 },
      hash: 'section',
    })
  )

  assertType(buildPath('about'))
  assertType(buildPath('about', { searchParams: { q: 'foo' } }))
  assertType(
    buildPath('about', { searchParams: { q: 'foo', hash: 'section' } })
  )
})

test('invalid', () => {
  // @ts-expect-error
  assertType(buildPath('posts/[id]/comments/[commentId]'))
  // @ts-expect-error
  assertType(buildPath('posts/[id]/comments/[commentId]', { id: 1 }))
  // @ts-expect-error
  assertType(buildPath('posts/[id]/comments/[commentId]', { commentId: 1 }))
  // @ts-expect-error
  assertType(buildPath('about', { id: 1 }))
  // @ts-expect-error
  assertType(buildPath('about', { searchParams: 1 }))
  // @ts-expect-error
  assertType(buildPath('about', { hash: 1 }))
  // @ts-expect-error
  assertType(buildPath('not-defined'))
})
