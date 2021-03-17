const { config } = require('./config');
const appBase = require('../app-base');

module.exports.start = () => appBase.start(config);
module.exports.stop = () => appBase.stop(config);
module.exports.status = () => appBase.status(config);
module.exports.config = config;
