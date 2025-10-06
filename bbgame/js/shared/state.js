import { GAMEPLAY } from './constants.js';

export const GameState = {
  selectedCharacter: null, // 'walter' | 'jesse'
  money: 0,
  heat: 0,
  notoriety: 0,
  cookedUnits: 0,
  soldUnits: 0,
  productInventory: 0,
  unlocked: { suburbs: false, city: false },
  location: 'Desert',
  disclaimersAcknowledged: false,

  lastPlayerSafePosition: { x: 0, y: 0 },

  reset() {
    this.selectedCharacter = null;
    this.money = 0;
    this.heat = 0;
    this.notoriety = 0;
    this.cookedUnits = 0;
    this.soldUnits = 0;
    this.productInventory = 0;
    this.unlocked = { suburbs: false, city: false };
    this.location = 'Desert';
    this.disclaimersAcknowledged = false;
    this.lastPlayerSafePosition = { x: 0, y: 0 };
  },

  maybeDecayHeat(deltaMs) {
    if (this.heat <= 0) return;
    const decay = (GAMEPLAY.heatDecayPerSecond * deltaMs) / 1000;
    this.heat = Math.max(0, this.heat - decay);
  },

  tryUnlocks() {
    if (!this.unlocked.suburbs && this.cookedUnits >= GAMEPLAY.suburbsUnlock.cookedUnits && this.soldUnits >= GAMEPLAY.suburbsUnlock.soldUnits) {
      this.unlocked.suburbs = true;
      return 'Suburbs unlocked!';
    }
    if (!this.unlocked.city && this.cookedUnits >= GAMEPLAY.cityUnlock.cookedUnits && this.soldUnits >= GAMEPLAY.cityUnlock.soldUnits) {
      this.unlocked.city = true;
      return 'City unlocked!';
    }
    return null;
  },
};
