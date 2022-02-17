import ora from 'ora';
import { resolve } from 'path';
import prettyBytes from 'pretty-bytes';
import { getBorderCharacters, table } from 'table';
import { loadIgnorePatterns } from '../../lib/load-ignore-patterns';
import { prune } from '../../lib/prune';

export async function pruneCmd(
  options: {
    force: boolean;
    currentWorkingDirectory: string;
    verbose: boolean;
    stats: boolean;
    config: string;
  },
) {
  const prunedFiles: string[] = [];
  let prunedSize = BigInt(0);
  let prunedElements = BigInt(0);
  const configFile = resolve(options.config);
  const patterns = await loadIgnorePatterns(configFile);

  const spinner = ora('Cleaning node_modules ...').start();

  const pruneStream = prune({
    cwd: options.currentWorkingDirectory,
    ignorePattern: patterns,
    force: options.force,
  });

  for await (const match of pruneStream) {
    prunedSize += BigInt(match.size);
    prunedElements++;
    prunedFiles.push(match.path);
  }

  spinner.stop();

  //  print file list of deleted items
  if (options.verbose) {
    for (const file of prunedFiles) {
      console.info(file);
    }
  }

  //  print statistic
  if (options.stats) {
    const nrFormat = new Intl.NumberFormat();

    console.log(
      table(
        [
          ['Items', nrFormat.format(prunedFiles.length)],
          ['Estimated size', prettyBytes(Number(prunedSize))]
        ],
        {
          border: getBorderCharacters('norc'),
        },
      ),
    );
  }

  if (!options.force) {
    console.log('To permanently delete the files rerun the command with the "--force" flag');
  } else {
    console.log('Modules cleaned');
  }
}
