'use strict';

const ringUtils = require('./utils/keys');
const assert = require('assert');
const bcoin = require('bcoin');
const Amount = bcoin.amount;
const Coin = bcoin.coin;
const MTX = bcoin.mtx;
const Script = bcoin.script;
const Address = bcoin.address;

const network = 'regtest';

const [ring] = ringUtils.getRings(1, network);
ring.witness = true;

const address = ring.getNestedAddress();

console.log(`Address: ${address}`);

const sendTo = 'RTJCrETrS6m1otqXRRxkGCReRpbGzabDRi';
const txinfo = {
  // prevout
  hash: '36c36ffa8f192a424d0a8e3ba5fde0e7764a5a2f146db32854a5d71b18218cfa',
  index: 0,

  value: Amount.fromBTC('20').toValue(),
  script: Script.fromAddress(address)
};

const coin = Coin.fromOptions(txinfo);

(async () => {
  const spend = new MTX();

  // Let's spend 10 BTC only
  spend.addOutput(sendTo, Amount.fromBTC('10').toValue());

  await spend.fund([coin], {
    rate: 10000,
    changeAddress: address
  }).then()

  spend.sign(ring);

  assert(spend.verify());

  console.log('Transaction is ready');
  console.log('Now you can broadcast it to the network');
  console.log(spend.toRaw().toString('hex'));
})().catch((e) => {
  console.error(e);
});
