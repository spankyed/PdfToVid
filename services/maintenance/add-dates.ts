import { store } from '../src/database/schema';
import type Datastore from '@seald-io/nedb';

// https://github.com/spankyed/CurateGPT/blob/e956c911021ba42d4f75ea75853a7ab8e0248b90/server/src/http/utils.ts#L136

async function storeDay(day: string): Promise<void> {
  const existingDay = await store.days.findOneAsync({ value: day });

  if (!existingDay) {
    await store.days.insertAsync({ value: day, status: 'pending' });
  }
}

const days = [
  '2023-09-07',
  '2023-09-06',
]

days.forEach(day => storeDay(day));
