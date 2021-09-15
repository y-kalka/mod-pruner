import { readdir, stat } from 'fs/promises';
import { join } from 'path';

interface IDirectorySizeResult {
  files: string[];
  size: number;
}

export async function getDirectorySize(directory: string): Promise<IDirectorySizeResult> {
  const res: IDirectorySizeResult = {
    files: [],
    size: 0,
  };

  const dirItems = await readdir(directory);

  for (const item of dirItems) {
    const path = join(directory, item);
    const stats = await stat(path);

    res.size += stats.size;

    if (stats.isDirectory()) {
      const subdirectoryRes = await getDirectorySize(path);
      res.size += subdirectoryRes.size;
      res.files.push(...subdirectoryRes.files);
    } else {
      res.files.push(path);
    }
  }

  return res;
}
