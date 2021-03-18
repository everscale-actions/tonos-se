const replace = require('replace-in-file');

function setPortBase(targets) {
  // eslint-disable-next-line no-restricted-syntax
  for (const target of targets) {
    replace.sync(target);
  }
}

module.exports.setPortBase = setPortBase;
