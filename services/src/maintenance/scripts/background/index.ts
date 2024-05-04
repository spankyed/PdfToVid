import onboard from "./states/onboard";
import doDailyOperations from "./states/operate-daily";

const stateHandlers = {
  onboarding: onboard, // todo rename to first run
  operating: doDailyOperations
};

// const state = 'operating';
const state = 'onboarding';

async function runBackgroundScripts() {
  console.log('Initializing maintenance server...');

  // todo check if chroma is up and running

  // stateHandlers[state]();

  console.log('Maintenance server initialized.');
}



export default runBackgroundScripts
