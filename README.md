# hurricane-electric-bandwidth

## What is this?

Programatic method to retrieve your bandwidth usage.

## Typical Usage:

```
var HurricaneElectricBandwidth = require('hurricane-electric-bandwidth');

HurricaneElectricBandwidth.scrapBandwidth('ABC==').then(function(bandwidth) {
  console.log(bandwidth);
})
```

`1001000`
