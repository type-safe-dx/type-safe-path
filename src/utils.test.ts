import { describe, it, expect } from "vitest";
import { normalizePath, removePathExtension, removePrefix, removeSuffix } from "./utils";

describe("normalizePath", () => {
  it("normalizePath should add slash to the beginning", () => {
    expect(normalizePath("posts/[id]")).toBe("/posts/[id]");
  });

  it("normalizePath should remove the slash in the end", () => {
    expect(normalizePath("/posts/[id]/")).toBe("/posts/[id]");
  });
});

describe("removePathExtension", () => {
  it("removePathExtension should remove .tsx", () => {
    expect(removePathExtension("posts/[id]/index.tsx")).toBe("posts/[id]/index");
  });
});

describe("removePrefix", () => {
  it("removePrefix should remove the `pages` characters", () => {
    expect(removePrefix("pages/posts/index", "pages")).toBe("/posts/index");
  });
});

describe("removeSuffix", () => {
  it("removeSuffix should remove the `index` characters", () => {
    expect(removeSuffix("posts/index", "index")).toBe("posts/");
  });
});
