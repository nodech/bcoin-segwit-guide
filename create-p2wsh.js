'use strict';

const ringUtils = require('./utils/keys');
const assert = require('assert');
const bcoin = require('bcoin');
const Script = bcoin.script;
const bech32 = bcoin.utils.bech32;

const network = 'regtest';
const [ring, ring2] = ringUtils.getRings(2, network);

ring.witness = true;
ring2.witness = true;

console.log('P2WSH');

// Now we can create p2wsh script
// You'll notice that, this is similar to
// regular multisig transaction
const pubkeys = [ring.publicKey, ring2.publicKey];
const multisigScript = Script.fromMultisig(1, 2, pubkeys);

// Let's give the rings the script to hash it.
ring.script = multisigScript;
ring2.script = multisigScript;

// Now when we request address it should get generated
const address = ring.getAddress();

console.log('Address from ring:', address.toString());

const addrRes = bech32.decode(address.toString());

// data in bech32 should be md5(script)
assert(addrRes.hash.equals(multisigScript.sha256()));

// We'll leave out script, fromProgram because they are the same
// as p2wpkh
