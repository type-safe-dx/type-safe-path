import path from "path";

export async function extractQueryType({
  filePath,
  source,
  outputPath,
}: {
  filePath: string;
  source: string;
  routeDir: string;
  outputPath: string;
}): Promise<string | null> {
  if (!source.includes("export type Query")) return null;

  if (/.*(ts|tsx)$/.test(filePath)) {
    const importPath = path.relative(outputPath, filePath).replace(/\.(ts|tsx)?$/, "");
    return `import('${importPath}').Query`;
  }

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
