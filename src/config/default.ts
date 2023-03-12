import { removePathExtension, removeSuffix } from "../utils";
import { Config } from "./type";

export const defaultFilePathToRoutePath: NonNullable<Config["filePathToRoutePath"]> = ({
  filePath,
  routeDir,
}) => {
  return removeSuffix(removePathExtension(filePath), "index"); // posts/[id]/index.tsx => posts/[id]/index => posts/[id]/
};
