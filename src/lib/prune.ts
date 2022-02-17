import * as fg from "fast-glob";
import type { Stats } from 'fs';
import { rm } from 'fs/promises';
import ignore from 'ignore';
import { pruneEmptyFolder } from './utils/prune-empty-folder';

type PruneArgs = {
  cwd: string;
  force: boolean;
  ignorePattern: string[];
}

type PruneAction = {
  path: string;
  size: number;
}

export async function* prune({ cwd, ignorePattern, force }: PruneArgs): AsyncGenerator<PruneAction> {
  const ig = ignore({
    ignorecase: true,
  }).add(ignorePattern);

  const fileStream = fg.stream(
    ['**/node_modules/**'],
    {
      cwd: cwd,
      dot: true,
      onlyFiles: true,
      followSymbolicLinks: false,
      absolute: true,
      markDirectories: true,
      stats: true,
      objectMode: true,
    },
  );

  for await (const file of fileStream) {
    const path: string = (file as any).path;
    const size: number = ((file as any).stats as Stats).size;

    // only keep the path after node_modules "../node_modules/lodash/package.json" to "lodash/package.json"
    const ignorePath = path.replace(/^.+\/node_modules\//, '');
    const keep = ig.ignores(ignorePath) === false;

    if (keep) {
      continue;
    }

    // Delete the file permanently
    if (force) {
      await rm(path);
    }

    yield {
      path: path,
      size: size,
    }
  }

  // Now prune all empty folders
  await pruneEmptyFolder({ cwd, force });
}
