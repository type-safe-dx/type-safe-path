import { describe, it, expect } from "vitest";
import { ArrowFunction, deepMerge } from "../src/utils";

describe(
	"merge",
	() => {
		describe.concurrent(
			"only object",
			() => {
				it(
					"simply",
					() => {
						expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
					},
				);
				it(
					"nest",
					() => {
						expect(deepMerge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({
							a: { b: 1, c: 2 },
						});
					},
				);
				it(
					"different key size",
					() => {
						expect(deepMerge({ a: 1 }, { b: 2, c: 3 })).toEqual({
							a: 1,
							b: 2,
							c: 3,
						});
						expect(deepMerge({ a: 1, b: 2 }, { c: 3 })).toEqual({
							a: 1,
							b: 2,
							c: 3,
						});
					},
				);
				it(
					"ArrowFunction",
					() => {
						expect(
							JSON.stringify(
								deepMerge(
									new ArrowFunction("foo", { a: 1 }),
									new ArrowFunction("foo", { b: 2 }),
								),
							),
						).toEqual(`"(foo:string)=>({a:1,b:2})"`);
					},
				);
			},
		);
	},
);
