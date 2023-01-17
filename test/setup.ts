import { createPathHelperFromPathList } from '../src/core'
import fs from 'fs'

export function setup() {
  fs.writeFileSync(
    'test/generated/bracket/output.ts',
    createPathHelperFromPathList(['about', 'posts/[id]/comments/[commentId]'], {
      dynamicSegmentPattern: 'bracket',
    })
  )
  fs.writeFileSync(
    'test/generated/colon/output.ts',
    createPathHelperFromPathList(['about', 'posts/:id/comments/:commentId'], {
      dynamicSegmentPattern: 'colon',
    })
  )
}
