import { store } from '../database/schema';
import type Datastore from '@seald-io/nedb';

// https://github.com/spankyed/CurateGPT/blob/e956c911021ba42d4f75ea75853a7ab8e0248b90/server/src/http/utils.ts#L136

async function storeDate(date: string): Promise<void> {
  const existingDate = await store.dates.findOneAsync({ value: date });

  if (!existingDate) {
    await store.dates.insertAsync({ value: date, status: 'pending' });
  }
}

const dates = [
  '2023-09-07',
  '2023-09-06',
]

dates.forEach(date => storeDate(date));
