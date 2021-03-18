const nginx = require('./nginx');
const arango = require('./arango');
const qServer = require('./q-server');
const tonNode = require('./ton-node');

module.exports = [arango, tonNode, qServer, nginx];
