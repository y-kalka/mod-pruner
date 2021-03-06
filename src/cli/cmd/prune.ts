import * as ora from "ora";
import { resolve } from "path";
import * as prettyBytes from "pretty-bytes";
import { getBorderCharacters, table } from "table";
import { loadIgnorePatterns } from "../../lib/load-ignore-patterns";
import { prune } from "../../lib/prune";

export async function pruneCmd(options: {
  force: boolean;
  currentWorkingDirectory: string;
  verbose: boolean;
  stats: boolean;
  config: string;
}) {
  let prunedSize = BigInt(0);
  let prunedFiles = 0;
  const configFile = resolve(options.config);
  const patterns = await loadIgnorePatterns(configFile);

  const spinner = ora("Cleaning node_modules ...").start();

  const pruneStream = prune({
    cwd: options.currentWorkingDirectory,
    ignorePattern: patterns,
    force: options.force,
  });

  for await (const match of pruneStream) {
    prunedSize += BigInt(match.size);
    prunedFiles++;

    //  print file list of deleted items
    if (options.verbose) {
      console.info(match.path);
    }
  }

  spinner.stop();

  //  print statistic
  if (options.stats) {
    const nrFormat = new Intl.NumberFormat();

    console.log(
      table(
        [
          ["Files", nrFormat.format(prunedFiles)],
          ["Estimated size", prettyBytes(Number(prunedSize))],
        ],
        {
          border: getBorderCharacters("norc"),
        }
      )
    );
  }

  if (!options.force) {
    console.log(
      'To permanently delete the files rerun the command with the "--force" flag'
    );
  } else {
    console.log("Modules cleaned");
  }
}
