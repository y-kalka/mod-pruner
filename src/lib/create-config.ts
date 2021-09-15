import { stat, writeFile } from 'fs/promises';
import { EOL } from 'os';
import { PATTERN_GROUPS } from './pattern-groups';

interface ICreateConfigOptions {
  cwd: string;
  outFile: string;
  overwrite?: boolean;
  includedConfigGroups: string[];
  environment: 'prod' | 'dev';
}

export async function createConfig(
  options: ICreateConfigOptions,
): Promise<{ error?: Error; }> {
  const fileBody = [];
  // get all pattern groups that should be included
  const patternGroups = PATTERN_GROUPS.filter(group => options.includedConfigGroups.indexOf(group.id) !== -1);

  for (const group of patternGroups) {
    fileBody.push(`# ${group.id}`);

    if (group.description) {
      fileBody.push(`# ${group.description}`);
    }

    for (const pattern of group.patterns) {

      if (options.environment === 'dev' && pattern.env === 'prod') {
        continue;
      }

      if (options.environment === 'prod' && pattern.env === 'dev') {
        continue;
      }

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

  const existingFileStats = await stat(options.outFile).catch(() => null);

  // do not write the file if there is already one
  if (existingFileStats && options.overwrite === false) {
    return { error: Error('File exists') };
  }

  await writeFile(options.outFile, fileBody.map(line => line.trim()).join(EOL));

  return {};
}
