'use strict';

const ringUtils = require('./utils/keys');
const bcoin = require('bcoin');
const Script = bcoin.script;

const network = 'regtest';
const [ring, ring2] = ringUtils.getRings(2, network);

ring.witness = true;
ring2.witness = true;

// Using KeyRing
console.log('P2SH-P2WSH addresses');

// Now we can create p2wsh script
// You'll notice that, this is similar to
// regular multisig transaction
const pubkeys = [ring.publicKey, ring2.publicKey];
const multisigScript = Script.fromMultisig(1, 2, pubkeys);

// Let's give the ring the script to hash it.
ring.script = multisigScript;

// Now when we request address it should get generated
const address = ring.getNestedAddress();

console.log('Address from ring:', address.toString());
