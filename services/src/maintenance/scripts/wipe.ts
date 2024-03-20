import { store } from '../database/schema';
import type Datastore from '@seald-io/nedb';

async function wipeAllDatastores(): Promise<void> {
  await wipeDatastore(store.dates);
  await wipeDatastore(store.config);
  await wipeDatastore(store.papers);
  console.log('All datastores have been wiped.');

  async function wipeDatastore(datastore: Datastore<any>): Promise<void>  {
    await datastore.removeAsync({}, { multi: true });
  };
};

// wipeAllDatastores();
