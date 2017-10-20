'use strict';

const ringUtils = require('./utils/keys');

// Network is important when creating addresses
// and storing private keys, You don't want to accidentally spend
// or confuse keys/transactions/addresses with different networks.

const network = 'regtest';

const [ring] = ringUtils.getRings(1, network);

ring.witness = true;

// P2SH/P2WPKH
// We can put P2WPKH script in P2SH too,
// this way we'll accept funds from old clients.

// Basically we need to grab the P2PKH script
// and wrap it into P2SH )

console.log('P2SH/P2WPKH');

// In order to get P2SH we need
const address = ring.getNestedAddress();

console.log('Nested Address:', address.toString());
