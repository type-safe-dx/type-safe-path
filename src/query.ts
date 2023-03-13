import path from "path";

export async function extractQueryType({
  routeFileAbsolutePath,
  source,
  outputAbsolutePath,
}: {
  routeFileAbsolutePath: string;
  source: string;
  outputAbsolutePath: string;
}): Promise<string | null> {
  if (!source.includes("export type Query")) return null;

  if (/.*(ts|tsx)$/.test(routeFileAbsolutePath)) {
    const importPath = path
      .relative(path.resolve(outputAbsolutePath), path.resolve(routeFileAbsolutePath))
      .replace(new RegExp("../"), "") // result of path.resolve is one deeper than expected, so remove one level of "../"
      .replace(/\.(ts|tsx)?$/, "");
    return `import('${importPath}').Query`;
  }

  const startIndex = source.indexOf("export type Query");
  const endIndex = (() => {
    let openBraceCount = 0;
    let closeBraceCount = 0;
    for (let i = startIndex; i < source.length; i++) {
      if (source[i] === "{") openBraceCount++;
      if (source[i] === "}") closeBraceCount++;

      if (openBraceCount > 0 && openBraceCount === closeBraceCount) {
        return i;
      }
    }
    throw Error(`invalid source code: ${routeFileAbsolutePath}`);
  })();

  const searchParamsTypeDef = source.slice(startIndex, endIndex + 1);

  return /(\{[\s\S]*\})/.exec(searchParamsTypeDef)?.[1].trim() ?? null;
}
