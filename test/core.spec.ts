import { describe, it, expect } from "vitest";
import { defaultConfig } from "../src/config";
import { createPathObjectStringByPathList } from "../src/core";

describe.concurrent(
	"only one file (ts)",
	() => {
		it(
			"posts/index.svelte",
			() => {
				expect(createPathObjectStringByPathList(["posts/index.svelte"])).toEqual(
					"export const PATHS={posts:{index:`/posts`}}",
				);
			},
		);

		it(
			"posts/edit.svelte",
			() => {
				expect(createPathObjectStringByPathList(["posts/edit.svelte"])).toEqual(
					"export const PATHS={posts:{edit:`/posts/edit`}}",
				);
			},
		);

		it(
			"posts/[id]/index.svelte",
			() => {
				expect(createPathObjectStringByPathList(["posts/[id]/index.svelte"])).toEqual(
					"export const PATHS={posts:{id:(id:string)=>({index:`/posts/${id}`})}}",
				);
			},
		);

		it(
			"posts/[id].svelte",
			() => {
				expect(createPathObjectStringByPathList(["posts/[id].svelte"])).toEqual(
					"export const PATHS={posts:{id:(id:string)=>`/posts/${id}`}}",
				);
			},
		);

		it(
			"posts/[id]/edit.svelte",
			() => {
				expect(createPathObjectStringByPathList(["posts/[id]/edit.svelte"])).toEqual(
					"export const PATHS={posts:{id:(id:string)=>({edit:`/posts/${id}/edit`})}}",
				);
			},
		);
	},
);

describe.concurrent(
	"base path",
	() => {
		it(
			"multiple file (ts)",
			() => {
				expect(
					createPathObjectStringByPathList([
						"posts/index.svelte",
						"posts/[id]/index.svelte",
						"posts/[id]/edit.svelte",
					]),
				).toEqual(
					"export const PATHS={posts:{index:`/posts`,id:(id:string)=>({index:`/posts/${id}`,edit:`/posts/${id}/edit`})}}",
				);
			},
		);

		it(
			"nested file (ts)",
			() => {
				expect(
					createPathObjectStringByPathList([
						"posts/[postId]/comments/[commentId]/index.svelte",
					]),
				).toEqual(
					"export const PATHS={posts:{postId:(postId:string)=>({comments:{commentId:(commentId:string)=>({index:`/posts/${postId}/comments/${commentId}`})}})}}",
				);
			},
		);
	},
);

describe.concurrent(
	"ignore file",
	() => {
		it(
			"default ignorePattern",
			() => {
				expect(
					createPathObjectStringByPathList([
						"posts/index.svelte",
						"posts/_components/PostInfo.svelte",
					]),
				).toEqual("export const PATHS={posts:{index:`/posts`}}");
			},
		);

		it(
			"customized ignorePattern",
			() => {
				expect(
					createPathObjectStringByPathList(
						["posts/index.svelte", "posts/$components/PostInfo.svelte"],
						{ ...defaultConfig, ignorePattern: /^\$.*/ },
					),
				).toEqual("export const PATHS={posts:{index:`/posts`}}");
			},
		);
	},
);

describe.concurrent(
	"dynamicPattern config",
	() => {
		it(
			"customized",
			() => {
				const customizedConfig = { dynamicPattern: /^_(\w+)/ };
				expect(
					createPathObjectStringByPathList(
						["posts/_id/index.svelte"],
						customizedConfig,
					),
				).toEqual(
					"export const PATHS={posts:{id:(id:string)=>({index:`/posts/${id}`})}}",
				);

				expect(
					createPathObjectStringByPathList(
						["posts/_id.svelte"],
						customizedConfig,
					),
				).toEqual("export const PATHS={posts:{id:(id:string)=>`/posts/${id}`}}");
			},
		);
	},
);
