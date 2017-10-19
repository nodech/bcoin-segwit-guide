'use strict';

const bcoin = require('bcoin');
const fs = require('fs');
const KeyRing = bcoin.keyring;

const getFilename = (index, network) => {
  return `keys/${network}-${index}.wif`;
};

const getRing = (network) => {
  return KeyRing.generate(true, network);
};

const saveRing = (index, ring, network) => {
  fs.writeFileSync(`keys/${network}-${index}.wif`, ring.toSecret(network));
};

exports.getRings = (count, network) => {
  const rings = new Array(count);

  for (let i = 0; i < count; i++) {
    const fn = getFilename(i, network);

    let ring;

    if (!fs.existsSync(fn)) {
      ring = getRing(network);
      saveRing(i, ring, network);
    } else {
      const key = fs.readFileSync(fn).toString();
      ring = KeyRing.fromSecret(key);
    }

    rings[i] = ring;
  }

  return rings;
};
