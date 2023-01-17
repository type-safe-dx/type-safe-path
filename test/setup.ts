import { createPathHelperFromPathList } from '../src/core'
import fs from 'fs'

export function setup() {
  fs.writeFileSync(
    'test/generated/output.ts',
    createPathHelperFromPathList(['about', 'posts/[id]/comments/[commentId]'], {
      dynamicSegmentPattern: 'bracket',
    })
  )
}
