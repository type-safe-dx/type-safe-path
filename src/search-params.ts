import fs from "fs/promises";

export async function extractQueryType(filePath: string): Promise<string | null> {
  if (/.*(ts|tsx)$/.test(filePath)) return `import('${filePath.replace(/\.(ts|tsx)$/, "")}').Query`;

  return await extractQueryTypeFromSourceString(filePath);
}

async function extractQueryTypeFromSourceString(filePath: string): Promise<string | null> {
  const source = await fs.readFile(filePath, "utf-8");
  if (!source.includes("export type Query")) return null;

  let openBraceCount = 0;
  let closeBraceCount = 0;

  const startIndex = source.indexOf("export type Query");
  const endIndex = (() => {
    for (let i = startIndex; i < source.length; i++) {
      if (source[i] === "{") openBraceCount++;
      if (source[i] === "}") closeBraceCount++;

      if (openBraceCount > 0 && openBraceCount === closeBraceCount) {
        return i;
      }
    }
    throw Error(`invalid source code: ${filePath}`);
  })();

  const searchParamsTypeDef = source.slice(startIndex, endIndex + 1);

  return /(\{[\s\S]*\})/.exec(searchParamsTypeDef)?.[1].trim() ?? null;
}
