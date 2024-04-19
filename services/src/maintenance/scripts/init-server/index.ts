import onboard from "./states/onboard";
import doDailyOperations from "./states/operate-daily";

const stateHandlers = {
  onboarding: onboard,
  operating: doDailyOperations
};

// const state = 'operating';
const state = 'onboarding';

async function initializeServer() {
  console.log('Initializing maintenance server...');

  stateHandlers[state]();

  console.log('Maintenance server initialized.');
}



export default initializeServer
