'use strict';

const ringUtils = require('./utils/keys');
const assert = require('assert');
const bcoin = require('bcoin');
const Amount = bcoin.amount;
const Script = bcoin.script;
const Coin = bcoin.coin;
const MTX = bcoin.mtx;
const revHex = bcoin.util.revHex;

const network = 'regtest';

const [ring, ring2] = ringUtils.getRings(2, network);
ring.witness = true;
ring2.witness = true;

const pubkeys = [ring.publicKey, ring2.publicKey];
const redeemScript = Script.fromMultisig(1, 2, pubkeys);

// let's grab the address
ring.script = redeemScript;

const receivingAddress = ring.getNestedAddress();

console.log('Address for p2sh-p2wsh:', receivingAddress.toString());

// reset script and cache states
ring.script = null;
ring.refresh();

const script = Script.fromAddress(receivingAddress);

const sendTo = 'RTJCrETrS6m1otqXRRxkGCReRpbGzabDRi';
const txhash = revHex('376ed4ddf59e89af352b304b9f6255dd9fa04e59'
                    + 'bf75cabeb4ed5d6783573a6a');
const txinfo = {
  // prevout
  hash: txhash,
  index: 0,

  value: Amount.fromBTC('20').toValue(),
  script: script
};

const coin = Coin.fromOptions(txinfo);

(async () => {
  // Now let's spend our tx
  const spend1 = new MTX();

  ring.script = redeemScript;

  spend1.addOutput({
    address: sendTo,
    value: Amount.fromBTC('10').toValue()
  });

  await spend1.fund([coin], {
    changeAddress: receivingAddress,
    rate: 10000
  });

  spend1.scriptInput(0, coin, ring);
  spend1.signInput(0, coin, ring);

  // Now you should see that our TX
  // has two witness items in it:
  // First is the signature
  // Second redeem script
  const input = spend1.inputs[0];
  const redeem = input.witness.getRedeem();
  assert(redeem.equals(redeemScript));

  // we need to give this tx to another user
  // to sign
  const raw = spend1.toRaw();

  // Let's give our raw TX to another guy
  const spend2 = MTX.fromRaw(raw);

  spend2.view.addCoin(coin);
  spend2.signInput(0, coin, ring2);

  assert(spend2.verify(), 'Transaction isn\'t valid');

  // Now we can broadcast it
  console.log(spend2.toRaw().toString('hex'));
})().catch((e) => {
  console.error(e);
});

