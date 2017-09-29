const rp = require('request-promise');

function getCountryCode(req, res) {
  rp({
    url: 'http://api.geonames.org/countryCodeJSON',
    json: true,
    qs: {
      username: 'eisacke',
      lat: req.query.lat,
      lng: req.query.lng
    }
  }).then(response => res.json(response));
}

module.exports = {
  getCountryCode
};
