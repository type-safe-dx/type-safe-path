export interface Config {
	targetGlob: string,
	output: string,
	ignorePattern: string | RegExp | null,
	dynamicPattern: string | RegExp,
}

export const defaultConfig: Config = {
	targetGlob: "pages/**/*.tsx",
	output: "path.ts",
	ignorePattern: /^_.*/,
	dynamicPattern: /^\[(\w+)\]/,
};
