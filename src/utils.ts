export class ArrowFunction {
	constructor(
		public argName: string,
		public returnObj: Record<string, unknown> | string,
		public opt: { isTS: boolean } = { isTS: true },
	) {}

	toJSON() {
		return `(${this.argName}${this.opt.isTS ? ":string" : ""})=>${
			typeof this.returnObj === "string" ? this.returnObj : `(${JSON.stringify(
				this.returnObj,
			).replace(/"/g, "")})`
		}`;
	}
}

export function deepMerge(objA: Record<string, any>, objB: Record<string, any>): Record<
	string,
	any
> {
	for (const key in objB) {
		if (
			(objA[key] instanceof ArrowFunction) && (
				objB[key] instanceof ArrowFunction
			)
		) {
			if (objA[key].argName === objB[key].argName) {
				objA[key] =
					new ArrowFunction(
						objA[key].argName,
						deepMerge(objA[key].returnObj, objB[key].returnObj),
					);
			}
		} else if (objA[key] instanceof Object) {
			objA[key] = deepMerge(objA[key], objB[key]);
		} else {
			objA[key] = objB[key];
		}
	}

	return objA;
}
