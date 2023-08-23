// wipeAllDatastores();
async function wipeAllDatastores(): Promise<void> {
  await wipeDatastore(store.days);
  await wipeDatastore(store.config);
  await wipeDatastore(store.papers);
  console.log('All datastores have been wiped.');

  async function wipeDatastore(datastore: Datastore<any>): Promise<void>  {
    await datastore.removeAsync({}, { multi: true });
  };
};
