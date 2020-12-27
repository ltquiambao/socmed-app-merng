const path = require('path');
const debug = require('debug');

module.exports = function(dirname, filename) {
  const customDebug = debug(`${path.basename(dirname)}:${path.basename(filename)}`);

  return (head, body) => {
    customDebug(head);
    customDebug(body);
    customDebug(`========================================`)
  }
}