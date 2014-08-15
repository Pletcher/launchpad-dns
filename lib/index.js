var dns = require('./dns');

exports.register = function Dns(plugin, options, next) {
  plugin.method('dns', dns(options));

  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
