import { Config } from "./config";

type Option = { hasSrcDir?: boolean };

export const nextPreset = ({ hasSrcDir }: Option): Config => ({
	targetGlob: `${hasSrcDir ? "src/" : ""}pages/**/*.{tsx,jsx}`,
	output: `${hasSrcDir ? "src/" : ""}path.ts`,
	ignorePattern: null,
	dynamicPattern: /^\[(\w+)\]/,
});

export const nuxt2Preset = ({ hasSrcDir }: Option): Config => ({
	targetGlob: `${hasSrcDir ? "src/" : ""}pages/**/*.vue`,
	output: `${hasSrcDir ? "src/" : ""}path.ts`,
	ignorePattern: null,
	dynamicPattern: /^_.*/,
});

export const nuxtPreset = ({ hasSrcDir }: Option): Config => ({
	targetGlob: `${hasSrcDir ? "src/" : ""}pages/**/*.vue`,
	output: `${hasSrcDir ? "src/" : ""}path.ts`,
	ignorePattern: null,
	dynamicPattern: /^\[(\w+)\]/,
});

export const svelteKitPreset = (): Config => ({
	targetGlob: "src/routes/**/*.{svelte,json.js,json.ts}",
	output: "src/path.ts",
	ignorePattern: /^_.*/,
	dynamicPattern: /^\[(\w+)\]/,
});
