export type Config = {
  routeDir: string;
  /**
   * Glob pattern to match route files (Relative to routeDir).
   */
  routesGlob: string;
  /**
   * Glob pattern to ignore route files (Relative to routeDir).
   */
  ignoreGlob?: string | string[];
  filePathToRoutePath?: ({ filePath, routeDir }: { filePath: string; routeDir: string }) => string;
  dynamicSegmentPattern: "bracket" | "colon" | RegExp;
  output?: string;
};

export const defineConfig = (config: Partial<Config>) => config;
