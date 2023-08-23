

// backfillDays('2023-05-01'); // ! change this to like a week ago and create beginner friendly script

export async function backfillDays (date: string): Promise<void> {
  const today = new Date();
  const startDay = new Date(date);

  // Get dates between May 1, 2023, and today
  const daysToBackfill = getWeekdaysBetween(startDay.toISOString().split('T')[0], today.toISOString().split('T')[0]);

  for (const date of daysToBackfill) {
    await storeDay(date);
  }

  console.log('Backfill completed.');
};

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


function createQueue(){
  const queue: any[] = [];
  let isProcessing = false;

  return {
    push: (item: any) => {
      queue.push(item);
      if (!isProcessing) {
        processQueue();
      }
    },
  };

  async function processQueue() {
    isProcessing = true;
    while (queue.length) {
      const item = queue.shift();
      await item();
    }
    isProcessing = false;
  }
};