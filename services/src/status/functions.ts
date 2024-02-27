type Status = { current: string; updated?: boolean; final?: boolean; data?: any };
type StatusMap = { [key: string]: Status };
type Type = 'days' | 'papers';

const entries = {
  days: {} as StatusMap,
  papers: {} as StatusMap
}

export function addStatusEntry(type: Type, ev: { key: string; status: string; }) {
  const { key, status } = ev;
  console.log('add status: ', {key, status});
  // if (entries[type][key]) { // ! uncomment: needed for consistency
  //   return false;
  // }

  entries[type][key] = { current: status };

  return true;
}

export function updateStatusEntry(
  type: Type, 
  { key, status, data, final }: { key: string; status: string; data: any; final: boolean; }
) {
  console.log('update status: ', {key, status});
  if (!entries[type][key]) {
    return false;
  }

  entries[type][key].current = status;
  entries[type][key].data = data;
  entries[type][key].final = final;
  entries[type][key].updated = true;
  
  return true;
}

export function getStatusEntry(type: Type, key: string) {
  const status = entries[type][key];
  console.log('get status: ', {key});
  // console.log('get status: ', {key, status});

  if (!status) {
    return null;
  }

  const { current, updated, data } = status;

  if (status.updated) {
    entries[type][key].updated = false;
  }

  if (status.final) {
    delete entries[type][key];
  }

  return { current, updated, data };
}
