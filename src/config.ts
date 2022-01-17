export interface Config {
  ignorePattern: string | RegExp
  dynamicPattern: string | RegExp
}

export const defaultConfig: Config = {
  ignorePattern: /^_.*/,
  dynamicPattern: /^\[(\w+)\]/,
}
