/* global describe it */

const expect = require('chai').expect;
const MockAdapter = require('axios-mock-adapter');
const HurricaneElectricBandwidth = require('../index.js');

describe('parseBandwidthSpeed()', function () {
  it('should work for bytes', function () {
    expect(HurricaneElectricBandwidth.parseBandwidthSpeed('1001 b/s')).to.be.equal(1001);
  });

  it('should work for kilobytes', function () {
    expect(HurricaneElectricBandwidth.parseBandwidthSpeed('1001 kb/s')).to.be.equal(1001000);
  });

  it('should work for megabytes', function () {
    expect(HurricaneElectricBandwidth.parseBandwidthSpeed('1001 mb/s')).to.be.equal(1001000000);
  });

  it('should work for gigabytes', function () {
    expect(HurricaneElectricBandwidth.parseBandwidthSpeed('1001 gb/s')).to.be.equal(1001000000000);
  });

  it('should throw an exception with invalid unit', function () {
    expect(HurricaneElectricBandwidth.parseBandwidthSpeed, '1001 x/s').to.throw();
  });

  it('should throw an exception without an input', function () {
    expect(HurricaneElectricBandwidth.parseBandwidthSpeed).to.throw();
  });

  it('should throw an exception with non string inputs', function () {
    expect(HurricaneElectricBandwidth.parseBandwidthSpeed, 1).to.throw();
    expect(HurricaneElectricBandwidth.parseBandwidthSpeed, {}).to.throw();
    expect(HurricaneElectricBandwidth.parseBandwidthSpeed, null).to.throw();
  });
});

describe('scrapBandwidth()', function () {

  const mock = new MockAdapter(HurricaneElectricBandwidth.requestInstance);

  it('should work when the bandwidth element is present', function (done) {
    mock.onGet().reply(200, '<div class=\'graph95\'><div class=\'graphtext\'>95th percentile:</div><div class=\'graphnum\'>1001.0 kb/s</div></div></div>');

    HurricaneElectricBandwidth.scrapBandwidth('ABC==').then(function(bandwidth) {
      expect(bandwidth).to.be.equal(1001000);
      done();
    }).catch(() => {
      done(Error('Should not have had an error.'));
    });
  });

  it('should not work when the bandwidth element is not present', function (done) {
    mock.onGet().reply(200, '<div>hello world</div>');

    HurricaneElectricBandwidth.scrapBandwidth('ABC==').then(function() {
      done(Error('Should have had an exception if it couldn\'t be found'));
    }).catch(() => {
      done();
    });
  });
});
