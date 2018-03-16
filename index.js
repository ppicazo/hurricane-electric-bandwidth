const axios = require('axios');
const cheerio = require('cheerio');

const UNIT_CONVERSION_MAP = {
  'b/s': 1,
  'kb/s': 1000,
  'mb/s': 1000 ** 2,
  'gb/s': 1000 ** 3
};

module.exports = {
  requestInstance: axios.create({
    baseURL: 'http://traffic.he.net',
    paramsSerializer: params => { return `key=${params.key}` },
    timeout: 20000
  }),

  parseBandwidthSpeed: function(input) {
    if (input instanceof String || typeof input == 'string') {
      const value = input.split(' ')[0];
      const units = input.split(' ')[1];
      if (!isNaN(value) && units in UNIT_CONVERSION_MAP) {
        return value * UNIT_CONVERSION_MAP[units];
      }
    }
    throw Error; // Yes this is super lame and vague...
  },

  scrapBandwidth: function(graphKey) {
    return new Promise((resolve, reject) => {
      this.requestInstance.get('/port.php', { params: { key: graphKey } })
        .then(response => {
          let $ = cheerio.load(response.data);
          $('div.graph95 div.graphnum').each( (i, elm) => {
            resolve(this.parseBandwidthSpeed($(elm).text()));
          });
          reject(Error('Element not found.'));
        })
        .catch(error => {
          reject(error);
        });
    });
  },
};
