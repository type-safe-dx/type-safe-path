import { createPathHelper } from "../src/core";
import fs from "fs";
import { execSync } from "child_process";

export function setup() {
  fs.writeFileSync(
    "test/generated/bracket/output.ts",
    createPathHelper(["about", "posts/[id]/comments/[commentId]"], {
      dynamicSegmentPattern: "bracket",
    }),
  );
  fs.writeFileSync(
    "test/generated/colon/output.ts",
    createPathHelper(["about", "posts/:id/comments/:commentId"], {
      dynamicSegmentPattern: "colon",
    }),
  );
}
