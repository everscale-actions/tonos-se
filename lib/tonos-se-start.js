const install = require('./install');
const getStatuses = require('./tonos-se-status');
const appsPool = require('./apps/apps-pool');
const PortsAlreadyInUseError = require('./errors/ports-already-in-use');

async function checkPortAvailability() {
  const statuses = await getStatuses();
  const alreadyInUsePorts = [];

  statuses
    .filter((status) => !status.isRunning)
    .map((status) => ({
      serviceName: status.serviceName,
      inUsePorts: status.portStatuses.filter((ps) => ps.inUse).map((ps) => ps.port),
    }))
    .forEach((sp) => sp.inUsePorts
      .forEach((p) => alreadyInUsePorts
        .push({ serviceName: sp.serviceName, port: p })));

  if (alreadyInUsePorts.length > 0) {
    throw new PortsAlreadyInUseError(alreadyInUsePorts);
  }
}

async function startApps() {
  for (let i = 0; i < appsPool.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await appsPool[i].start();
  }
}

async function start() {
  await install(); // create structure and download files if needed

  await checkPortAvailability();

  await startApps();
}

module.exports = start;
