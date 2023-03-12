import { expect, test } from "vitest";
import { extractQueryType } from "./query";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(dirname, "../test/generated/query/output.ts");

test.each(["ts", "tsx"])("extract from $1 file", async (ext) => {
  const filePath = path.resolve(dirname, `../test/fixtures/query/page.${ext}`);
  const query = await extractQueryType({
    filePath,
    source: await fs.readFile(filePath, "utf-8"),
    routeDir: "",
    outputPath,
  });
  expect(query).toBe(`import('../../../fixtures/query/page').Query`);
});

test("extract from source file", async () => {
  const filePath = path.resolve(dirname, "../test/fixtures/query/+page.svelte");
  const query = await extractQueryType({
    filePath,
    source: await fs.readFile(filePath, "utf-8"),
    routeDir: "",
    outputPath,
  });
  expect(query).toMatchInlineSnapshot(`
    "{
        foo: { a: string; b: string }
        bar: number
      }"
  `);
});

test("return null if no `export type Query` exists", async () => {
  const filePath = path.resolve(dirname, "../test/fixtures/query/non-query-page.vue");
  const query = await extractQueryType({
    filePath,
    source: await fs.readFile(filePath, "utf-8"),
    routeDir: "",
    outputPath,
  });
  expect(query).toBeNull();
});
