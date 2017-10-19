'use strict';

const ringUtils = require('./utils/keys');
const assert = require('assert');
const bcoin = require('bcoin');
const bech32 = bcoin.utils.bech32;
const Script = bcoin.script;
const opcodes = Script.opcodes;

const network = 'regtest';
const [ring] = ringUtils.getRings(1, network);

ring.witness = true;

console.log('P2WPKH Addresses');
// Let's create P2WPKH address
const pubkeyhash = ring.getKeyHash('hex');
let address = ring.getAddress();

console.log('Address from ring:', address.toString());

// If we inspect bech32 address you'll see there's
// only pubkeyhash in data part of bech32
const addrRes = bech32.decode(address.toString());

assert(addrRes.hash.toString('hex') === pubkeyhash);

// Script that will be later generated for pubKeyScript
// looks like the following:
let p2wpkhScript = new Script();
p2wpkhScript.pushOp(opcodes.OP_0);
p2wpkhScript.pushData(ring.getKeyHash());
p2wpkhScript.compile();

// You can generate address from this script too
address = p2wpkhScript.getAddress();
console.log('Address from script:', address.toString(network));

// This is will generate the same Script same as above.
p2wpkhScript = Script.fromProgram(0, ring.getKeyHash());
address = p2wpkhScript.getAddress();
console.log('Address from Program:', address.toString(network));

