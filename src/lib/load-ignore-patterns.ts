import { yellow } from 'chalk';
import { readFile } from 'fs/promises';
import { basename } from 'path';
import { DEFAULT_GLOBS } from './constants';

export async function loadIgnorePatterns(file: string): Promise<string[]> {
  let fileContent = await readFile(file, 'utf-8').catch(() => null);

  // load the default globs if no config was found
  if (!fileContent) {
    // Show a warning
    console.warn(`Found no "${basename(file)}" file in the current working directory. Using the default patterns now.`);
    console.warn(yellow('The default patterns may change over time and it is recommended to provide your own patterns file. You can create a patterns file with "npx mod-pruner init"'));

    fileContent = DEFAULT_GLOBS.trim();
  }

  return fileContent
    .split('\n')
    .map(pattern => pattern.replace(/#.*/, ''))             // remove comments
    .filter(pattern => !!pattern);                          // remove empty lines
}
