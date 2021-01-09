import { ChessTrap } from '../entity/chessTrap';

import bsgTrap from './blackburneShillingGambit';
export { bsgTrap as bsgTrap};

import elephantTrap from './elephant';
export { elephantTrap as elephantTrap};

import fishingPoleTrap from './fishingPole';
export { fishingPoleTrap as fishingPoleTrap};

import legalTrap from './legal';
export { legalTrap as legalTrap };

import laskerTrap from './lasker';
export { laskerTrap as laskerTrap};

import englundGambitTrap from './englundGambit';
export { englundGambitTrap as englundGambitTrap };

const allTraps: ChessTrap[] = [
  bsgTrap,
  elephantTrap,
  fishingPoleTrap,
  legalTrap,
  laskerTrap,
  englundGambitTrap,
];

export default allTraps;
