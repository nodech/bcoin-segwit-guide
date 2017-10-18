'use strict';

const fs = require('fs');
const assert = require('assert');
const bcoin = require('bcoin');
const Script = bcoin.script;
const opcodes = Script.opcodes;
const KeyRing = bcoin.keyring;
const bech32 = bcoin.utils.bech32;

// Network is important when creating addresses
// and storing private keys, You don't want to accidentally spend
// or confuse keys/transactions/addresses with different networks.

const network = 'regtest';

// Segwit only accepts compressed pubkeys
const compressed = true;

const ring = KeyRing.generate(compressed, network);
const ring2 = KeyRing.generate(compressed, network);
const ring3 = KeyRing.generate(compressed, network);

// Let's store all keys
fs.writeFileSync(`${network}-key1.wif`, ring.toSecret(network));
fs.writeFileSync(`${network}-key2.wif`, ring2.toSecret(network));
fs.writeFileSync(`${network}-key3.wif`, ring3.toSecret(network));

ring.witness = true;
ring2.witness = true;
ring3.witness = true;

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
