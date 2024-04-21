import config from '@config'; // Ensure this import works as expected, and adjust the import path if necessary

export function getConfig() {
  if (!config && !(config as any).default){
    return {}
  }

  return (config as any).default
}
