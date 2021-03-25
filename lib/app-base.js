const start = require('./app-base-start');
const stop = require('./app-base-stop');
const status = require('./app-base-status');

module.exports = (config) => ({
  start: () => start(config),
  stop: () => stop(config),
  status: () => status(config),
});
