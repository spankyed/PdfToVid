type Status = { current: string; updated?: boolean; data?: any };
type StatusMap = { [key: string]: Status };
type Type = 'days' | 'papers';

const statuses = {
  days: {} as StatusMap,
  papers: {} as StatusMap
}

export function setStatus(type: Type, ev: { key: string; status: string; }) {
  const { key, status } = ev;
  if (statuses[type][key]) {
    return false;
  }

  statuses[type][key] = { current: status };

  return true;
}

export function updateStatus(type: Type, { key, status, data }: { key: string; status: string; data: any }) {
  if (!statuses[type][key]) {
    return false;
  }
  statuses[type][key].current = status;
  statuses[type][key].data = data;
  statuses[type][key].updated = true;
  
  return true;
}

export function getStatus(type: Type, key: string, deleteOnUpdate = true) {
  const status = statuses[type][key];

  if (!status) {
    return null;
  }

  const { current, updated, data } = status;

  if (status.updated && deleteOnUpdate) {
    delete statuses[type][key];
  }
    
  return { current, updated, data };
}
