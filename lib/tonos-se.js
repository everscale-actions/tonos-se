require('./global.js');

module.exports.start = require('./control-start');
module.exports.stop = require('./control-stop');
module.exports.reset = require('./control-reset');
module.exports.restart = require('./control-restart');
module.exports.status = require('./control-status');
module.exports.config = require('./settings');
