const nginx = require('./nginx/module');
const arango = require('./arango/module');
const qServer = require('./q-server/module');
const tonNode = require('./ton-node/module');

module.exports.appsPool = [arango, tonNode, qServer, nginx];
