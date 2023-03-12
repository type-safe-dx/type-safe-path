/* eslint-disable @typescript-eslint/ban-ts-comment */
import { test, assertType } from "vitest";
import { $path } from "./output";

test("valid", () => {
  assertType($path("/posts/:id/comments/:commentId", { params: { id: 1, commentId: 1 } }));
  assertType(
    $path("/posts/:id/comments/:commentId", {
      params: { id: 1, commentId: 1 },
      query: { q: "foo" },
    }),
  );
  assertType(
    $path("/posts/:id/comments/:commentId", {
      params: { id: 1, commentId: 1 },
      hash: "section",
    }),
  );
  assertType(
    $path("/posts/:id/comments/:commentId", {
      params: { id: 1, commentId: 1 },
      query: { q: 1 },
      hash: "section",
    }),
  );

  assertType($path("/about", { query: { q: "foo" } }));
  assertType($path("/about", { query: { q: "foo" } }));
  assertType($path("/about", { query: { q: "foo", hash: "section" } }));
});

test("invalid", () => {
  // @ts-expect-error
  assertType($path("posts/:id/comments/:commentId"));
  // @ts-expect-error
  assertType($path("posts/:id/comments/:commentId", { id: 1 }));
  // @ts-expect-error
  assertType($path("posts/:id/comments/:commentId", { commentId: 1 }));
  // @ts-expect-error
  assertType($path("about", { id: 1 }));
  // @ts-expect-error
  assertType($path("about", { query: 1 }));
  // @ts-expect-error
  assertType($path("about", { hash: 1 }));
  // @ts-expect-error
  assertType($path("not-defined"));
});
