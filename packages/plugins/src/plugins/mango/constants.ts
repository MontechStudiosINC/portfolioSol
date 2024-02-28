import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'mango';
export const mangoPlatform: Platform = {
  id: platformId,
  name: 'Mango',
  image: 'https://sonar.watch/img/platforms/mango.png',
  defiLlamaId: 'parent#mango-markets',
  website: 'https://mango.markets/',
};
export const banksPrefix = `${platformId}-banks`;
export const rootBankPrefix = `${platformId}-rootBank`;
export const groupPrefix = `${platformId}-group`;
export const boostBanksKey = 'boost-banks';

export const mangoV4Pid = new PublicKey(
  '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg'
);

export const redeemProgramId = new PublicKey(
  'mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68'
);

export const boostProgramId = new PublicKey(
  'zF2vSz6V9g1YHGmfrzsY497NJzbRr84QUrPry4bLQ25'
);
