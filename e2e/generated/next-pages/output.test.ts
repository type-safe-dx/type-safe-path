import { expect, test } from "vitest";
import { $path, $echoPath } from "./output";

test("build path with params, query, hash", () => {
  expect(
    $path("/posts/[id]/comments/[commentId]", {
      params: { id: 1, commentId: 2 },
      query: { q: 1 },
      hash: "section",
    }),
  ).toBe("/posts/1/comments/2?q=1#section");

  expect($path("/about", { query: { q: "hoge" } }));
});

test("$echoPath should returns the argument", () => {
  expect($echoPath("/posts/[id]/comments/[commentId]")).toBe("/posts/[id]/comments/[commentId]");
  expect($echoPath("/api/hello")).toBe("/api/hello");
});
