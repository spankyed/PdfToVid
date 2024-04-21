import fs from 'fs/promises';
import path from 'path';
import oldConfig from '@config'; // Ensure this import works as expected, and adjust the import path if necessary
import { fileURLToPath } from 'url';
import { merge } from 'lodash-es';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '../../../../config.ts');

export async function setConfig(newSettings: any) {

  const updatedConfig = merge({}, (oldConfig as any).default, { settings: newSettings });

  const serializedConfig = `export default ${JSON.stringify(updatedConfig, null, 2)};\n`;

  await fs.writeFile(configPath, serializedConfig, 'utf8');
}
