const replace = require('replace-in-file');

function setPortBase(targets) {
  targets.map((target) => {
    const result = replace.sync(target);
    // console.log(`${JSON.stringify(target)} ==> ${JSON.stringify(result)}`);
    return result;
  });
}

module.exports.setPortBase = setPortBase;
