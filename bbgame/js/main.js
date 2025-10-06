import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import WorldScene from './scenes/WorldScene.js';
import CookingScene from './scenes/CookingScene.js';
import SellingScene from './scenes/SellingScene.js';
import UIScene from './scenes/UIScene.js';
import { WORLD } from './shared/constants.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#0b0b10',
  width: Math.max(960, window.innerWidth),
  height: Math.max(540, window.innerHeight),
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, WorldScene, CookingScene, SellingScene, UIScene],
};

// Create global game
// eslint-disable-next-line no-new
new Phaser.Game(config);

// Handle resize to ensure canvas resizes with window
window.addEventListener('resize', () => {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
});
