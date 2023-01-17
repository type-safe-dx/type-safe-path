export type Config = {
  routeDir: string
  routesGlob: string
  ignoreGlob?: string
  filePathToRoutePath?: (filePath: string) => string
}

export const defineConfig = (config: Config) => config
