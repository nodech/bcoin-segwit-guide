'use strict';

const ringUtils = require('./utils/keys');
const assert = require('assert');
const bcoin = require('bcoin');
const Amount = bcoin.amount;
const Coin = bcoin.coin;
const MTX = bcoin.mtx;
const Script = bcoin.script;
const revHex = bcoin.util.revHex;

const network = 'regtest';

const [ring] = ringUtils.getRings(1, network);
ring.witness = true;

const address = ring.getAddress();

console.log(`Address where we received money: ${address}`);

const sendTo = 'RTJCrETrS6m1otqXRRxkGCReRpbGzabDRi';
const txhash = revHex('88885ac82ab0b61e909755e7f64f2deeedb89c83'
                    + '3b68242da7de98c0934e1143');
const txinfo = {
  // prevout
  hash: txhash,
  index: 1,

  value: Amount.fromBTC('200').toValue(),
  script: Script.fromAddress(address)
};

const coin = Coin.fromOptions(txinfo);

(async () => {
  const spend = new MTX();

  // We need to calculate fee too
  // let's use .fund that will calculate fee
  // for us

  // Let's spend 100 BTC only
  spend.addOutput(sendTo, Amount.fromBTC('100').toValue());

  await spend.fund([coin], {
    rate: 10000,
    changeAddress: address
  });

  spend.sign(ring);

  assert(spend.verify());

  console.log('Transaction is ready');
  console.log('Now you can broadcast it to the network');
  console.log(spend.toRaw().toString('hex'));
})().catch((e) => {
  console.error(e);
});
