/* eslint-disable @typescript-eslint/ban-ts-comment */
import { test, assertType } from "vitest";
import { buildPath } from "./output";

test("valid", () => {
  assertType(buildPath("/posts/:id/comments/:commentId", { params: { id: 1, commentId: 1 } }));
  assertType(
    buildPath("/posts/:id/comments/:commentId", {
      params: { id: 1, commentId: 1 },
      query: { q: "foo" },
    }),
  );
  assertType(
    buildPath("/posts/:id/comments/:commentId", {
      params: { id: 1, commentId: 1 },
      hash: "section",
    }),
  );
  assertType(
    buildPath("/posts/:id/comments/:commentId", {
      params: { id: 1, commentId: 1 },
      query: { q: 1 },
      hash: "section",
    }),
  );

  assertType(buildPath("/about", { query: { q: "foo" } }));
  assertType(buildPath("/about", { query: { q: "foo" } }));
  assertType(buildPath("/about", { query: { q: "foo", hash: "section" } }));
});

test("invalid", () => {
  // @ts-expect-error
  assertType(buildPath("posts/:id/comments/:commentId"));
  // @ts-expect-error
  assertType(buildPath("posts/:id/comments/:commentId", { id: 1 }));
  // @ts-expect-error
  assertType(buildPath("posts/:id/comments/:commentId", { commentId: 1 }));
  // @ts-expect-error
  assertType(buildPath("about", { id: 1 }));
  // @ts-expect-error
  assertType(buildPath("about", { query: 1 }));
  // @ts-expect-error
  assertType(buildPath("about", { hash: 1 }));
  // @ts-expect-error
  assertType(buildPath("not-defined"));
});
