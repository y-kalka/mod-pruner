import { readFile } from 'fs/promises';

export async function loadIgnorePatterns(file: string): Promise<string[]> {
  let fileContent = await readFile(file, 'utf-8').catch(() => null);

  // load the default globs if no config was found
  if (!fileContent) {
    throw Error(`Config file "${file}" not found.`);
  }

  return fileContent
    .split('\n')
    .map(pattern => pattern.replace(/#.*/, ''))             // remove comments
    .filter(pattern => !!pattern);                          // remove empty lines
}
