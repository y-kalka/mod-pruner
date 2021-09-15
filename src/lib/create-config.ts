import { stat, writeFile } from 'fs/promises';
import { EOL } from 'os';
import { join } from 'path';
import { cwd } from 'process';
import { CONFIG_FILENAME } from './constants';
import { PATTERN_GROUPS } from './pattern-groups';

export async function createConfig(
  path = cwd(),
  overwrite = false,
  groups = PATTERN_GROUPS.filter(group => group.defaultInclude).map(group => group.id),
) {
  const fileBody = [];
  // get all pattern groups that should be included
  const patternGroups = PATTERN_GROUPS.filter(group => groups.indexOf(group.id) !== -1);
  const file = join(path, CONFIG_FILENAME);

  for (const group of patternGroups) {
    fileBody.push(`# ${group.id}`);

    if (group.description) {
      fileBody.push(`# ${group.description}`);
    }

    for (const pattern of group.patterns) {

      if (Array.isArray(pattern.pattern)) {
        for (const subPattern of pattern.pattern) {
          let line = subPattern;

          if (pattern.description) {
            line += ' #' + pattern.description.trim();
          }

          fileBody.push(line)
        }
      } else {
        let line = pattern.pattern;

        if (pattern.description) {
          line += ' #' + pattern.description.trim();
        }

        fileBody.push(line)
      }
    }
    fileBody.push('');
  }

  const existingFileStats = await stat(file).catch(() => null);

  // do not write the file if there is already one
  if (existingFileStats && overwrite === false) {
    throw Error('Found a existing config. Do you want to replace it? Try the "--foce" flag');
  }

  await writeFile(file, fileBody.map(line => line.trim()).join(EOL));
  return { file };
}
