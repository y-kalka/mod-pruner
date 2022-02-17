import { stat, writeFile } from "fs/promises";
import { join } from "path";
import { cwd } from "process";
import { CONFIG_FILENAME, DEFAULT_GLOBS } from "./constants";

export async function createConfig(path = cwd(), overwrite = false) {
  const file = join(path, CONFIG_FILENAME);

  const existingFileStats = await stat(file).catch(() => null);

  // do not write the file if there is already one
  if (existingFileStats && overwrite === false) {
    throw Error(
      'Found a existing config. Do you want to replace it? Try the "--foce" flag'
    );
  }

  await writeFile(file, DEFAULT_GLOBS.trim());
  return { file };
}
