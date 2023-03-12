import { expect, test } from "vitest";
import { buildPath, echoPath } from "./output";

test("build path with params, query, hash", () => {
  expect(
    buildPath("/posts/:id/comments/:commentId", {
      id: 1,
      commentId: 2,
      query: { q: 1 },
      hash: "section",
    }),
  ).toBe("/posts/1/comments/2?q=1#section");
});

test("echoPath should returns the argument", () => {
  expect(echoPath("/posts/:id/comments/:commentId")).toBe("posts/:id/comments/:commentId");
});
