import { describe, expect, it } from "vitest";
import { createPathHelper } from "./core";

describe("createPathHelperFromPathList", () => {
  it("bracket", async () => {
    expect(
      await createPathHelper(["about.tsx", "posts/[id]/comments/[commentId].tsx"], {
        dynamicSegmentPattern: "bracket",
      }),
    ).toMatchInlineSnapshot(`
      "// prettier-ignore
      // This file is auto generated. DO NOT EDIT

      type PathToParams = {
        '/about': never,
        '/posts/[id]/comments/[commentId]': {id: string | number, commentId: string | number}
      }

      /**
       * @example
       * buildPath('/posts/[id]', { id: 1 }) // => '/posts/1'
       */
      export function buildPath<Path extends keyof PathToParams>(
        path: Path,
        ...params: PathToParams[Path] extends never
          ? [
              params?: {
                query?: Record<string, string | number>
                hash?: string
              }
            ]
          : [
              params: PathToParams[Path] & {
                query?: Record<string, string | number>
                hash?: string
              }
            ]
      ): string {
        const [pathParams] = params
        if (pathParams === undefined) return path

        return (
          path.replace(/\\\\[(\\\\w+)\\\\]/g, (_, key) => (pathParams as any)[key]) +
          (pathParams.query
            ? '?' + new URLSearchParams(pathParams.query as any).toString()
            : '') +
          (pathParams.hash ? '#' + pathParams.hash : '')
        )
      }

      /**
       * @example
       * echoPath('/posts/[id]') // => '/posts/[id]'
       */
      export function echoPath<Path extends keyof PathToParams>(path: Path): string {
        return path
      }
      "
    `);
  });

  it("colon", async () => {
    expect(
      await createPathHelper(["about.tsx", "posts/:id/comments/:commentId.tsx"], {
        dynamicSegmentPattern: "colon",
      }),
    ).toMatchInlineSnapshot(`
      "// prettier-ignore
      // This file is auto generated. DO NOT EDIT

      type PathToParams = {
        '/about': never,
        '/posts/:id/comments/:commentId': {id: string | number, commentId: string | number}
      }

      /**
       * @example
       * buildPath('/posts/[id]', { id: 1 }) // => '/posts/1'
       */
      export function buildPath<Path extends keyof PathToParams>(
        path: Path,
        ...params: PathToParams[Path] extends never
          ? [
              params?: {
                query?: Record<string, string | number>
                hash?: string
              }
            ]
          : [
              params: PathToParams[Path] & {
                query?: Record<string, string | number>
                hash?: string
              }
            ]
      ): string {
        const [pathParams] = params
        if (pathParams === undefined) return path

        return (
          path.replace(/:(\\\\w+)/g, (_, key) => (pathParams as any)[key]) +
          (pathParams.query
            ? '?' + new URLSearchParams(pathParams.query as any).toString()
            : '') +
          (pathParams.hash ? '#' + pathParams.hash : '')
        )
      }

      /**
       * @example
       * echoPath('/posts/[id]') // => '/posts/[id]'
       */
      export function echoPath<Path extends keyof PathToParams>(path: Path): string {
        return path
      }
      "
    `);
  });
});
