var Nipple = require('nipple');

module.exports = function(options) {

  // `content` is, e.g., asm-products.github.io/slug
  return function(slug, content, callback) {
    var payload = {
      headers: {
        'X-DNSimple-Domain-Token': options.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      payload: {
        record: {
          record_type: 'CNAME',
          name: slug,
          content: content
        }
      }
    };

    Nipple.request('POST', options.uri, payload, function(err, response) {
      if (err) {
        return callback(err);
      }

      Nipple.read(response, { json: true }, function(err, body) {
        if (err) {
          return callback(err);
        }

        callback(null, body);
      });
    });
  };
};
