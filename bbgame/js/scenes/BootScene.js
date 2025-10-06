import { GameState } from '../shared/state.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create simple generated textures for player, rv, npc
    const g = this.add.graphics();

    // Player (Walter=blue, Jesse=orange generated later by tint)
    g.fillStyle(0x4fa3ff, 1);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture('player-blue', 32, 32);

    g.clear();
    g.fillStyle(0xff8b3d, 1);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture('player-orange', 32, 32);

    // RV
    g.clear();
    g.fillStyle(0xe5e1cf, 1);
    g.fillRoundedRect(0, 0, 96, 48, 8);
    g.fillStyle(0x9f9b88, 1);
    g.fillRect(10, 10, 20, 12);
    g.fillRect(40, 10, 20, 12);
    g.fillStyle(0x333333, 1);
    g.fillRect(8, 40, 16, 8);
    g.fillRect(72, 40, 16, 8);
    g.generateTexture('rv', 96, 48);

    // NPC
    g.clear();
    g.fillStyle(0xdddddd, 1);
    g.fillCircle(12, 12, 12);
    g.generateTexture('npc', 24, 24);

    g.destroy();
  }

  create() {
    // Disclaimers
    const w = this.scale.width;
    const h = this.scale.height;
    const lines = [
      'Blue Desert - Fictional Free-Roam',
      'All content is entirely fictional and satirical.',
      'No real drug processes or instructions are depicted.',
      'Set in a stylized New Mexico; please play responsibly.',
      '',
      'Press any key or click to continue',
    ];
    const text = this.add.text(w / 2, h / 2, lines.join('\n'), {
      fontSize: '22px',
      fontFamily: 'monospace',
      color: '#f0f0f0',
      align: 'center',
    }).setOrigin(0.5);

    const continueFn = () => {
      if (GameState.disclaimersAcknowledged) return;
      GameState.disclaimersAcknowledged = true;
      this.input.keyboard.off('keydown', continueFn);
      this.input.off('pointerdown', continueFn);
      this.scene.start('MenuScene');
    };

    this.input.keyboard.on('keydown', continueFn);
    this.input.on('pointerdown', continueFn);
  }
}
