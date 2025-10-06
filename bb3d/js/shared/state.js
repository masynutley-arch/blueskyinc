export const GameState = {
  selectedCharacter: 'walter',
  money: 0,
  heat: 0,
  notoriety: 0,
  cookedUnits: 0,
  soldUnits: 0,
  productInventory: 0,
  unlocked: { suburbs: false, city: false },
  timeOfDay: 12, // 0..24
  location: 'Desert',
  arrested: false,

  reset() {
    this.selectedCharacter = 'walter';
    this.money = 0;
    this.heat = 0;
    this.notoriety = 0;
    this.cookedUnits = 0;
    this.soldUnits = 0;
    this.productInventory = 0;
    this.unlocked = { suburbs: false, city: false };
    this.timeOfDay = 12;
    this.location = 'Desert';
    this.arrested = false;
  },

  tickTime(deltaSeconds) {
    this.timeOfDay = (this.timeOfDay + deltaSeconds * 0.01) % 24; // ~100s per in-game hour
  },

  tryUnlocks() {
    if (!this.unlocked.suburbs && this.cookedUnits >= 30 && this.soldUnits >= 30) this.unlocked.suburbs = true;
    if (!this.unlocked.city && this.cookedUnits >= 80 && this.soldUnits >= 80) this.unlocked.city = true;
  },
};
