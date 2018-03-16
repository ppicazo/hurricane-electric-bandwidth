# hurricane-electric-bandwidth

## What is this?

Programatic method to retrieve your 95th percentile bandwidth usage.

## Typical Usage

### In your code

#### Add to your project

```
npm install hurricane-electric-bandwidth
```

#### Use it

```
var HurricaneElectricBandwidth = require('hurricane-electric-bandwidth');
```

##### Get bandwidth usage in bytes per second
```
HurricaneElectricBandwidth.bandwidthBytes('ABC==').then(bandwidthBytes => {
  console.log(bandwidthBytes);
});
```
`1001000`

##### Get bandwidth usage raw string

```
HurricaneElectricBandwidth.scrapBandwidthText('ABC==').then(bandwidthText => {
  console.log(bandwidthText);
});
```
`1001 kb/s`

### Command line interface

#### Install
```
npm install -g hurricane-electric-bandwidth
```

#### Print in bytes
```
hurricane-electric-bandwidth ABC123
```
`1001000`

#### Print as the raw string
```
hurricane-electric-bandwidth ABC123 --raw
```
`1001 kb/s`
