export interface Config {
  ignorePattern: string | RegExp
}

export const defaultConfig: Config = {
  ignorePattern: '^_.*',
}
