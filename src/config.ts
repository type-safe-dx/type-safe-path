export type Config = {
  routeDir: string;
  routesGlob: string;
  ignoreGlob?: string;
  filePathToRoutePath?: (filePath: string) => string;
  dynamicSegmentPattern: "bracket" | "colon" | RegExp;
  output?: string;
};

export const defineConfig = (config: Config) => config;
