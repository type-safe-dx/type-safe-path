import { expect, test } from "vitest";
import { extractQueryType } from "./search-params";

test.each(["ts", "tsx"])("extract from $1 file", async (ext) => {
  const searchParams = await extractQueryType(`test/fixtures/search-params/page.${ext}`);
  expect(searchParams).toBe(`import('test/fixtures/search-params/page').Query`);
});

test("extract from source file", async () => {
  const searchParams = await extractQueryType("test/fixtures/search-params/+page.svelte");
  expect(searchParams).toMatchInlineSnapshot(`
    "{
        foo: { a: string; b: string }
        bar: number
      }"
  `);
});

test("return null if no `export type Query exists", async () => {
  const searchParams = await extractQueryType(
    "test/fixtures/search-params/non-search-params-page.vue",
  );
  expect(searchParams).toBeNull();
});
