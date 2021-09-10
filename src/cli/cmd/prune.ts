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
  const configFile = resolve(options.config);
  const patterns = await loadIgnorePatterns(configFile);

  const spinner = ora('Cleaning node_modules ...').start();

  const { prunedFiles, prunedDiskSize, prunedFolders } = await prune({
    cwd: options.currentWorkingDirectory,
    patterns,
    force: options.force,
  });

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
          ['Files', nrFormat.format(prunedFiles.length)],
          ['Folders', nrFormat.format(prunedFolders.length)],
          ['Total size', prettyBytes(prunedDiskSize)]
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
