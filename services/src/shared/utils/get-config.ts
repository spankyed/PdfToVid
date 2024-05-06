import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '../../../../config.ts');

export type Config = {
  settings: {
    autoAddNewDates?: boolean;
    autoScrapeNewDates?: boolean;
    isNewUser?: boolean;
  },
  features?: string[];
  seedReferencesIds?: string[];
};

export async function getConfig(): Promise<Config> {
  const fileContents = await fs.readFile(configPath, 'utf8')

  const rawJson = fileContents.replace('export default ', '').replace(';', '')

  return JSON.parse(rawJson)
}
