import { lstat, readdir, rmdir, unlink } from 'fs/promises';
import ignore, { Ignore } from 'ignore';
import { join, relative } from 'path';
import { findModuleDirectories } from './find-module-directories';
import { getDirectorySize } from './git-directory-size';

interface IPruneOptions {
  force: boolean;
  cwd: string,
  patterns: string[];
}

interface IPruneResult {
  prunedFiles: string[];
  prunedDiskSize: number;
  prunedFolders: string[];
}

export async function prune(options: IPruneOptions): Promise<IPruneResult> {
  const nodeModules = await findModuleDirectories(options.cwd);
  const ig = ignore({
    ignorecase: true,
  });
  const res: IPruneResult = {
    prunedDiskSize: 0,
    prunedFiles: [],
    prunedFolders: [],
  };

  ig.add(options.patterns);

  const pruneJobs = nodeModules.map((folder) => pruneModules(folder, folder, ig, options.force))
  const pruneResults = await Promise.all(pruneJobs);

  for (const pruneRes of pruneResults) {
    res.prunedDiskSize += pruneRes.prunedDiskSize;
    res.prunedFiles.push(...pruneRes.prunedFiles);
    res.prunedFolders.push(...pruneRes.prunedFolders);
  }

  return res;
}

async function pruneModules(folder: string, cwd: string, ignore: Ignore, force: boolean): Promise<IPruneResult> {
  const res: IPruneResult = {
    prunedDiskSize: 0,
    prunedFiles: [],
    prunedFolders: [],
  };
  const dirItems = await readdir(folder);

  // count the removed items to check for empty directories after the loop
  let removeItems = 0;
  for (const item of dirItems) {
    const absPath = join(folder, item);
    let relativPath = relative(cwd, absPath);
    const stats = await lstat(absPath);
    const isDir = stats.isDirectory();

    // do not follow symbolic links
    if (isDir && stats.isSymbolicLink()) {
      continue;
    }

    // add trailing slash to detect if the folder is ignored https://www.npmjs.com/package/ignore#2-filenames-and-dirnames
    if (isDir) {
      relativPath += '/';
    }

    if (ignore.ignores(relativPath) === true) {
      res.prunedDiskSize += stats.size;

      if (isDir) {
        // for directories
        const { size, files } = await getDirectorySize(absPath);
        res.prunedFiles.push(...files);
        res.prunedDiskSize += size;
        res.prunedFolders.push(absPath);
        if (force === true) {
          await rmdir(absPath, { recursive: true });
        }
      } else {
        // for files
        if (force === true) {
          await unlink(absPath);
        }
        res.prunedFiles.push(absPath);
      }

      removeItems++;
    } else {
      if (isDir) {
        const subFolderPrune = await pruneModules(absPath, folder, ignore, force);

        res.prunedDiskSize += subFolderPrune.prunedDiskSize;
        res.prunedFiles.push(...subFolderPrune.prunedFiles);
        res.prunedFolders.push(...subFolderPrune.prunedFolders);
      }
    }
  }

  // remove empty folders or folders that are now empty
  if (dirItems.length === 0 || dirItems.length === removeItems) {
    res.prunedFolders.push(folder);
    if (force === true) {
      await rmdir(folder);
    }
  }

  return res;
}
