'use strict';

const ringUtils = require('./utils/keys');
const bcoin = require('bcoin');
const Address = bcoin.address;

// Network is important when creating addresses
// and storing private keys, You don't want to accidentally spend
// or confuse keys/transactions/addresses with different networks.

const network = 'regtest';

const [ring, ring2] = ringUtils.getRings(2, network);

ring.witness = true;
ring2.witness = true;

// P2SH/P2WPKH
// We can put P2WPKH script in P2SH too,
// this way we'll accept funds from old clients.

// Basically we need to grab the P2PKH script
// and wrap it into P2SH )

console.log('P2SH/P2WPKH');

// We can generate P2SH several ways.
// We'll create it from the script
const program = ring.getProgram();

// Now need to generate the scripthash
// we could grab the scripthash from
// ring and script we pass to it
// but we can't use getScriptHash,
// when witness is enabled, we get
// sha256 hash.
// const sh = ring.getScriptHash();

ring.script = program;
// This will give us P2SH for P2WPKH script
const sh = ring.getScriptHash160();

console.log('Scripthash:', sh.toString('hex'));

// Now let's get address from script hash
const address = Address.fromScripthash(sh, network);

// We'll talk about redeeming it when we'll spend from it.
console.log('Address from scripthash:', address.toString());
