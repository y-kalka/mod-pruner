import { join } from 'path';
import { cwd } from 'process';
import { CONFIG_FILENAME } from '../../lib/constants';
import { PATTERN_GROUPS } from '../../lib/pattern-groups';
import { createConfig } from '../../public_api';

export async function initCmd(
  options: {
    force: boolean;
  },
) {
  const { error } = await createConfig({
    cwd: cwd(),
    outFile: join(cwd(), CONFIG_FILENAME),
    includedConfigGroups: PATTERN_GROUPS.filter(group => group.defaultInclude).map(group => group.id),
    overwrite: options.force,
    environment: 'prod',
  });

  if (error) {
    if (error.message === 'File exists') {
      console.log('Found a existing config. Do you want to replace it? Try the "--force" flag')
    }
  }
}
