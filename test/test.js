/* global describe it before after */

const expect = require('chai').expect;
const sinon = require('sinon');
const MockAdapter = require('axios-mock-adapter');
const HurricaneElectricBandwidth = require('../index.js');

// do it up here, prevent any real http requests in the tests
const mock = new MockAdapter(HurricaneElectricBandwidth.requestInstance);

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

describe('bandwidthBytes()', function () {
  before(function() {
    sinon.stub(HurricaneElectricBandwidth, 'parseBandwidthSpeed').returns(8675309);
    sinon.stub(HurricaneElectricBandwidth, 'scrapBandwidthText').returns(Promise.resolve('1337 kb/s'));
  });

  after(function() {
    HurricaneElectricBandwidth.parseBandwidthSpeed.restore();
    HurricaneElectricBandwidth.scrapBandwidthText.restore();
  });

  it('should work when the bandwidth element is present', function (done) {
    HurricaneElectricBandwidth.bandwidthBytes('ABC==').then(function(bandwidthBytes) {
      expect(bandwidthBytes).to.be.equal(8675309);
      expect(HurricaneElectricBandwidth.scrapBandwidthText.callCount).to.be.equal(1);
      expect(HurricaneElectricBandwidth.scrapBandwidthText.calledWith('ABC==')).to.be.true;
      expect(HurricaneElectricBandwidth.parseBandwidthSpeed.callCount).to.be.equal(1);
      expect(HurricaneElectricBandwidth.parseBandwidthSpeed.calledWith('1337 kb/s')).to.be.true;
      done();
    }).catch((err) => {
      done(err);
    });
  });
});

describe('scrapBandwidthText()', function () {
  it('should work when the bandwidth element is present', function (done) {
    mock.onGet().reply(200, '<div class=\'graph95\'><div class=\'graphtext\'>95th percentile:</div><div class=\'graphnum\'>1001.0 kb/s</div></div></div>');

    HurricaneElectricBandwidth.scrapBandwidthText('ABC==').then(function(bandwidthText) {
      expect(bandwidthText).to.be.equal('1001.0 kb/s');
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('should not work when the bandwidth element is not present', function (done) {
    mock.onGet().reply(200, '<div>hello world</div>');

    HurricaneElectricBandwidth.scrapBandwidthText('ABC==').then(function() {
      done(Error('Should have had an exception if it couldn\'t be found'));
    }).catch(() => {
      done();
    });
  });

  it('should not work when the graphKey is not supplied', function (done) {
    HurricaneElectricBandwidth.scrapBandwidthText().then(function() {
      done(Error('Should have had an exception if it couldn\'t be found'));
    }).catch((err) => {
      expect(err).to.be.equal('graphKey is required');
      done();
    });
  });

  it('should not work when the graphKey is not a string', function (done) {
    HurricaneElectricBandwidth.scrapBandwidthText(123).then(function() {
      done(Error('Should have had an exception if it couldn\'t be found'));
    }).catch((err) => {
      expect(err).to.be.equal('graphKey must be a string');
      done();
    });
  });

  it('should not work when the graphKey is an empty string', function (done) {
    HurricaneElectricBandwidth.scrapBandwidthText('').then(function() {
      done(Error('Should have had an exception if it couldn\'t be found'));
    }).catch((err) => {
      expect(err).to.be.equal('graphKey is required');
      done();
    });
  });
});
