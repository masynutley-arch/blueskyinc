import { GameState } from '../shared/state.js';
import { START_POSITIONS } from '../shared/constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.text(w / 2, 100, 'Select Character', {
      fontSize: '36px',
      fontFamily: 'monospace',
      color: '#f0f0f0',
    }).setOrigin(0.5);

    const walter = this.add.sprite(w / 2 - 200, h / 2, 'player-blue').setInteractive({ useHandCursor: true });
    const jesse = this.add.sprite(w / 2 + 200, h / 2, 'player-orange').setInteractive({ useHandCursor: true });

    this.add.text(walter.x, walter.y + 60, 'Walter (Cook/Business)', { fontSize: '18px', color: '#9aa0a6' }).setOrigin(0.5);
    this.add.text(jesse.x, jesse.y + 60, 'Jesse (Selling)', { fontSize: '18px', color: '#9aa0a6' }).setOrigin(0.5);

    const select = (name) => {
      GameState.reset();
      GameState.selectedCharacter = name; // 'walter' | 'jesse'
      if (name === 'walter') {
        GameState.lastPlayerSafePosition = { ...START_POSITIONS.walter };
      } else {
        GameState.lastPlayerSafePosition = { ...START_POSITIONS.jesse };
      }
      this.scene.start('WorldScene');
    };

    walter.on('pointerover', () => walter.setScale(1.15));
    walter.on('pointerout', () => walter.setScale(1));
    jesse.on('pointerover', () => jesse.setScale(1.15));
    jesse.on('pointerout', () => jesse.setScale(1));

    walter.on('pointerdown', () => select('walter'));
    jesse.on('pointerdown', () => select('jesse'));

    this.add.text(w / 2, h - 80, 'New Mexico, USA — Desert • Ghetto • Suburbs • City', {
      fontSize: '16px',
      color: '#8bd3ff',
    }).setOrigin(0.5);
  }
}
