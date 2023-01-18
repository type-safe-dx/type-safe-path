// https://www.typescriptlang.org/play?ssl=41&ssc=1&pln=42&pc=1#code/KYDwDg9gTgLgBASwHY2FAZgQwMbDgBUykwFsBnAEQWxgQiSIE84BvAKDk7gG0BrYRgC44ZGFGQBzALrDR4pBIDcbAL5sYjMHgBKwEhABuwACqYEAGwA8AZTihUSACZkRYyQBo4pi3ZAPnrvISAHxwALxwtvbATi4ABgAkLMjoaAQqSd7mKnFwAPwEcMLWyhpacADiwDDaEACuqITEJNVoNr7+LnKSoRG6+kZZlhxc-YYmZlZjg5M2nnEA9EndCjnB8wC0y26rcesjnHEAdNtBOWzBymwLC3BgUNW0aBsIEkjQwGygkLBwZTr1RpEUitKBkSy1Bp4aKxQI9cJwhQdGIBSGoA75AjA8hUGh0BhQRgY4Ro6F+FHxU6SFQACipuwxBSapEo1Fo9CYcBuxgA8hQecIABaYJzmSRwdDQOAPCSgO7Y0FkYlwUnI2GJFgrCQqQRJFJpXSic5cTE0jEmqo1QHAZktVBQCHAUShGEBJDAIxQc1cJnY1l4jmE72cYSW0m20GO51qgIa-VQLHNAByIJUeTiwcxLB4+EQSETpBTLSkeVkOwkcDUJpNwmz3FzyEq1XDCvtUZgwRkiIrVa4AEo4AAyDE0w3wV2Ulhh60Rttj4IZZJIVIJpP2Y3VzgFFvNRWWNd+ULCOpIXjvADuSD7ypYKiu11ukoTkFEZAW3AQjik6k0Ol02Aha0Yy6ctem7YCVWtRkCxxNl8SYZVVQnOANS1FRuD1Zc0nwFQpEwlcVSdGANy3VgeAAaTzAgu3dT1KyHFV-3bYIbzUf5GO0QCoQgrUwP4RgIHQRjgAA0kWLYCTsHoUQ7gARhJbROIAcgWF8YDfD8vwWKSSBaFANJ0vSYAASS-JSWK4G44AAPTyNgpKQGSwAAJgU5SFkwAAjQFzIOKzbPs6T4DAeSOMsJTNKkbSIF0mJ1PfQy4tMqRfMs25bKAA

export interface ParamsDictionary {
  [key: string]: string;
}
type RemoveTail<S extends string, Tail extends string> = S extends `${infer P}${Tail}` ? P : S;
type GetRouteParameter<S extends string> = RemoveTail<
  RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
  `.${string}`
>;
// prettier-ignore
export type GetColonPathParams<Route extends string> = string extends Route
  ? ParamsDictionary
  : Route extends `${string}(${string}`
  ? ParamsDictionary //TODO: handling for regex parameters
  : Route extends `${string}:${infer Rest}`
  ? (GetRouteParameter<Rest> extends never
      ? ParamsDictionary
      : GetRouteParameter<Rest> extends `${infer ParamName}?`
      ? {
          [P in ParamName]?: string;
        }
      : {
          [P in GetRouteParameter<Rest>]: string;
        }) &
      (Rest extends `${GetRouteParameter<Rest>}${infer Next}` ? GetColonPathParams<Next> : unknown)
  : Record<never, never>;

// for posts/[id]
type RRec<Route extends string> = string extends Route
  ? ParamsDictionary
  : Route extends `${string}[${infer P}]${infer Rest}`
  ? { [K in P]: never } & RRec<Rest>
  : Record<never, never>;
export type GetBracketPathParams<Route extends string> = keyof RRec<Route>;
