import { GameState } from '../shared/state.js';

export default class CookingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CookingScene' });
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    const backdrop = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7);
    backdrop.setInteractive();

    const panel = this.add.rectangle(w / 2, h / 2, Math.min(720, w - 60), 380, 0x1e1e26, 1);
    panel.setStrokeStyle(2, 0x444444, 1);

    const title = this.add.text(w / 2, h / 2 - 150, 'RV “Cooking” — Fictional Minigame', {
      fontSize: '24px', color: '#f0f0f0', fontFamily: 'monospace', align: 'center',
    }).setOrigin(0.5);

    const tip = this.add.text(w / 2, h / 2 - 110, 'Mash A/D to “stir” — hit vague target to score. Purely fictional.', {
      fontSize: '14px', color: '#9aa0a6', fontFamily: 'monospace', align: 'center', wordWrap: { width: Math.min(700, w - 80), useAdvancedWrap: true },
    }).setOrigin(0.5);

    this.score = 0;
    this.target = Phaser.Math.Between(40, 60); // intentionally vague and not scientific
    this.progress = 0;
    this.requiredProgress = 100;

    this.adBar = this.add.rectangle(w / 2, h / 2 - 20, 320, 16, 0x333333);
    this.knob = this.add.rectangle(w / 2 - 160, h / 2 - 20, 8, 24, 0x8bd3ff);

    this.progressBar = this.add.rectangle(w / 2 - 160, h / 2 + 20, 0, 16, 0x5bd38f).setOrigin(0, 0.5);

    this.resultText = this.add.text(w / 2, h / 2 + 80, '', { fontSize: '16px', color: '#f0f0f0', fontFamily: 'monospace' }).setOrigin(0.5);

    this.keys = this.input.keyboard.addKeys({ A: 'A', D: 'D', ESC: 'ESC' });

    this.time.addEvent({ delay: 30, loop: true, callback: () => this.updateAD() });
  }

  updateAD() {
    const left = this.keys.A.isDown ? 1 : 0;
    const right = this.keys.D.isDown ? 1 : 0;
    this.score = Phaser.Math.Clamp(this.score + (right - left) * 1.8 + Phaser.Math.FloatBetween(-0.6, 0.6), 0, 100);

    const center = this.adBar.getCenter();
    const x = center.x - 160 + (this.score / 100) * 320;
    this.knob.setPosition(x, this.knob.y);

    // If within vague target window, progress fills faster
    const distance = Math.abs(this.score - this.target);
    const gain = distance < 20 ? Phaser.Math.Between(2, 4) : Phaser.Math.Between(0, 2);
    this.progress = Phaser.Math.Clamp(this.progress + gain, 0, this.requiredProgress);
    this.progressBar.width = (this.progress / this.requiredProgress) * 320;

    if (this.progress >= this.requiredProgress) {
      // Produce units with random quality score (flavor only)
      const units = Phaser.Math.Between(3, 8);
      const quality = Phaser.Math.Between(50, 95); // not used for pricing; flavor text only
      GameState.cookedUnits += units;
      GameState.productInventory += units;
      const unlockMsg = GameState.tryUnlocks();
      const msg = `Batch complete: +${units} units (fictional quality ${quality}%)` + (unlockMsg ? `\n${unlockMsg}` : '');
      this.resultText.setText(msg);
      this.time.delayedCall(1200, () => {
        this.scene.stop();
        this.scene.resume('WorldScene');
      });
    }

    // Randomly drift target to avoid precision
    if (Phaser.Math.Between(0, 100) < 3) {
      this.target = Phaser.Math.Clamp(this.target + Phaser.Math.Between(-4, 4), 20, 80);
    }
  }
}
