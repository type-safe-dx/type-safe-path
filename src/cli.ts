#!/usr/bin/env node

import minimist from "minimist";
import { red } from "kleur";
import glob from "tiny-glob/sync";
import { writeFileSync } from "fs";
import { createPathObjectStringByPathList } from "./core";

function main() {
	const argv = minimist(process.argv.slice(2));

	if (argv.help || argv.h) {
		return console.log(
			`\
tsp <path-regex> -o <output-path>
Example: tsp "src/routes/**" -o src/paths.ts
`,
		);
	}

	const [targetRegex] = argv._;
	const outputPath = argv.o || argv.out;

	if (!outputPath) {
		return console.error(
			red("-o or --out is required for specifying output path"),
		);
	}

	const pathList = glob(targetRegex);
	writeFileSync(outputPath, createPathObjectStringByPathList(pathList));
}

main();
