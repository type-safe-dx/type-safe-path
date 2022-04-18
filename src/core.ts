import { Config, defaultConfig } from "./config";
import { deepMerge, ArrowFunction } from "./utils";

/**
 * @param pathList e.g. posts/index.svelte
 * @param config
 * @returns const PATHS = { posts: { index: `/posts` } }
 */
export function createPathObjectStringByPathList(
	pathList: string[],
	config: Config = defaultConfig,
): string {
	let pathObject: Record<string, any> = {};
	pathList.forEach((path) => {
		if (path.startsWith("/")) {
			path = path.slice(1);
		}

		const segments = path.split("/");

		const { ignorePattern } = config;
		if (
			ignorePattern && segments.some(
				(segment) => new RegExp(ignorePattern).test(segment),
			)
		) {
			return;
		}

		let current: any =
			"`/" +
			omitExtension(path)
				.split("/")
				.map(
					(segment) =>
						segment.replace(new RegExp(config.dynamicPattern, "g"), "${$1}"),
				)
				.join("/")
				.replace(/\/index$/, "") +
			"`";

		segments
			.reverse()
			.forEach((segment) => {
				if (new RegExp(config.dynamicPattern).test(segment)) {
					// is dynamic segment e.g. [postId]
					const [, param] = segment.match(new RegExp(config.dynamicPattern)) ?? [];
					current = { [param]: new ArrowFunction(param, current) };
				} else {
					current = { [omitExtension(segment)]: current };
				}
			});
		pathObject = deepMerge(pathObject, current);
	});

	// remove double quotes in JSON to make valid JavaScript/TypeScript code.
	return "export const PATHS=" + JSON.stringify(pathObject).replace(/"/g, "");
}

/** @private */
function omitExtension(str: string) {
	if (!str.includes(".")) {
		return str;
	}
	return str.replace(/(.*)\..*/, "$1");
}
