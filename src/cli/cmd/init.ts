import { cwd } from 'process';
import { createConfig } from '../../public_api';

export async function initCmd(
  options: {
    force: boolean;
  },
) {
  await createConfig(cwd(), options.force);
}
