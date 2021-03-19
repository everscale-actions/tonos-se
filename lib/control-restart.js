const path = require('path');
const stop = require('./control-stop');

async function restart() {
  await stop();

  // delete module from cache to avoid loading from memory
  delete require.cache[path.join('.', 'tonos-se.js')];

  // eslint-disable-next-line global-require
  await require('./tonos-se').start();
}

module.exports = restart;
