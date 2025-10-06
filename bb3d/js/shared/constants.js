export const WORLD = {
  size: 6000,
  zones: {
    desert: { name: 'Desert', center: [0, 0] },
    ghetto: { name: 'Ghetto', center: [1500, 0] },
    suburbs: { name: 'Suburbs', center: [3000, 800], locked: true },
    city: { name: 'City', center: [4200, -800], locked: true },
  },
};

export const GAMEPLAY = {
  moveSpeed: 8,
  sprintMultiplier: 1.6,
  curfewStartHour: 22,
  curfewEndHour: 6,
  heatMax: 100,
  policeAlertThreshold: 60,
  npcMax: 30,
  priceByZone: { desert: 40, ghetto: 55, suburbs: 65, city: 85 },
};
