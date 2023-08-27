type Status = { current: string; updated: boolean; data: any };
type StatusMap = { [key: string]: Status };
type Type = 'days' | 'papers';

const statuses = {
  days: {} as StatusMap,
  papers: {} as StatusMap
}

export function setStatus(type: Type, key: string, status: string) {
  if (statuses[type][key]) {
    return false;
  }

  statuses[type][key].current = status;

  return true;
}

export function updateStatus(type: Type, key: string, status: string) {
  if (!statuses[type][key]) {
    return false;
  }
  statuses[type][key].current = status;
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
