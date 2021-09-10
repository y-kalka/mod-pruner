import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function findModuleDirectories(folder: string, folderName = 'node_modules'): Promise<string[]> {
  const nodeModules = [];

  for (const item of await readdir(folder)) {
    const fullPath = join(folder, item);

    if (item === folderName) {
      nodeModules.push(fullPath);
      continue;
    }

    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      const nodeModuleFromChild = await findModuleDirectories(fullPath);
      nodeModules.push(...nodeModuleFromChild);
    }
  }

  return nodeModules;
}
