import fg from "fast-glob";
import type { Stats } from 'fs';
import { unlink } from 'fs/promises';
import ignore from 'ignore';

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
      followSymbolicLinks: false,
      absolute: true,
      markDirectories: true,
      stats: true,
      objectMode: true,
    },
  );

  for await (const file of fileStream) {
    const path = (file as any).path;
    const size = ((file as any).stats as Stats).size;

    // only keep the path after node_modules "../node_modules/lodash/package.json" to "lodash/package.json"
    const ignorePath = path.replace(/^.+\/node_modules\//, '');
    const keepFile = ig.ignores(ignorePath) === false;

    if (keepFile) {
      continue;
    }

    // Delete the file permanently
    if (force) {
      await unlink(path);
    }

    yield {
      path: path,
      size: size,
    }
  }
}
