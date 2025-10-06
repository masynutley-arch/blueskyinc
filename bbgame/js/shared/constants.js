export const WORLD = {
  width: 4000,
  height: 3000,
};

// Define zone rectangles in world space
// Zones: Desert (start), Ghetto (start), Suburbs (locked), City (locked)
export const ZONES = {
  desert: { key: 'desert', name: 'Desert', x: 0, y: 0, width: 2200, height: 3000, color: 0xC2A25A },
  ghetto: { key: 'ghetto', name: 'Ghetto', x: 2200, y: 1500, width: 1800, height: 1500, color: 0x5C5C5C },
  suburbs: { key: 'suburbs', name: 'Suburbs', x: 2200, y: 0, width: 800, height: 1500, color: 0x5BA96F, locked: true },
  city: { key: 'city', name: 'City', x: 3000, y: 0, width: 1000, height: 1500, color: 0x3D4D7A, locked: true },
};

export const START_POSITIONS = {
  walter: { x: 400, y: 1500 },
  jesse: { x: 600, y: 1500 },
};

export const GAMEPLAY = {
  moveSpeed: 260,
  suburbsUnlock: { cookedUnits: 30, soldUnits: 30 },
  cityUnlock: { cookedUnits: 80, soldUnits: 80 },
  heatMax: 100,
  heatDecayPerSecond: 2,
  npcSpawnIntervalMs: 3000,
  npcMax: 14,
  basePrice: { desert: 40, ghetto: 55, suburbs: 65, city: 85 },
};

export const COLORS = {
  uiText: '#f0f0f0',
  warning: '#ffcf5d',
  bad: '#ff6b6b',
  good: '#5bd38f',
  neutral: '#9aa0a6',
};
