const replace = require('replace-in-file');

function transform(targets) {
  // eslint-disable-next-line no-restricted-syntax
  for (const target of targets) {
    replace.sync(target);
  }
}

module.exports = transform;
