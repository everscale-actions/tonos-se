const start = require('./control-start');
const stop = require('./control-stop');

async function restart() {
  await stop();
  await start();
}

module.exports = restart;
