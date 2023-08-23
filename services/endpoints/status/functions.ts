type Status = { current: string; updated: boolean };
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

export function getStatus(type: Type, key: string) {
  const status = statuses[type][key];

  if (!status) {
    return null;
  }

  const { current, updated } = status;

  if (status.updated) {
    delete statuses[type][key];
  }
    
  return { current, updated };
}
