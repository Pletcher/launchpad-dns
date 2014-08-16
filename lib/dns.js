var Nipple = require('nipple');

module.exports = function(options) {

  // `content` is, e.g., asm-products.github.io
  return function(slug, content, callback) {
    var requestBody = JSON.stringify({
      record: {
        record_type: 'CNAME',
        name: slug,
        content: content
      }
    });

    var payload = {
      headers: {
        'X-DNSimple-Domain-Token': options.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      payload: requestBody
    };

    Nipple.request('POST', options.uri, payload, function(err, response) {
      if (err) {
        return callback(err);
      }

      Nipple.read(response, { json: true }, function(err, body) {
        if (err) {
          console.error('there was an error reading the response');
          return callback(err);
        }

        callback(null, body);
      });
    });
  };
};
