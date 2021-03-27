const util = require('util');

function PortsAlreadyInUseError(portByServiceName) {
  const statusText = portByServiceName.map((s) => `${s.serviceName}(${s.port})`).join(' ');
  this.message = `!!! Ports already in use: ${statusText}`;
  this.statuses = portByServiceName;
  Error.captureStackTrace(this);
}

util.inherits(PortsAlreadyInUseError, Error);
PortsAlreadyInUseError.prototype.name = 'PortsAlreadyInUseError';

module.exports = PortsAlreadyInUseError;
