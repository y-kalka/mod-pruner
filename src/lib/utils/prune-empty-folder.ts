import * as fg from "fast-glob";
import { readdir, rm } from "fs/promises";

type PruneEmptyFolderArgs = {
  cwd: string;
  force: boolean;
};

export async function pruneEmptyFolder({
  cwd,
  force,
}: PruneEmptyFolderArgs): Promise<number> {
  let prunedFolders = 0;
  const folderStream = fg.stream(["**/node_modules/**"], {
    cwd: cwd,
    dot: true,
    followSymbolicLinks: false,
    onlyDirectories: true,
    absolute: true,
  });

  for await (const folder of folderStream) {
    if (typeof folder !== "string") {
      throw Error("Expected a string");
    }

    const isEmpty = await checkIsEmpty(folder);

    if (isEmpty) {
      prunedFolders++;

      if (force) {
        await rm(folder, { recursive: true });
      }
    }
  }

  // When we delete a empty child folder the parent folder is not empty at the time of the check. So we do another run delete empty folders
  if (prunedFolders !== 0) {
    prunedFolders += await pruneEmptyFolder({ cwd, force });
  }

  return prunedFolders;
}

async function checkIsEmpty(path: string): Promise<boolean> {
  const dirContent = await readdir(path);
  return dirContent.length === 0;
}
