import { GameState } from '../shared/state.js';
import { GAMEPLAY } from '../shared/constants.js';

export default class SellingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SellingScene' });
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    const backdrop = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7);
    backdrop.setInteractive();

    const panel = this.add.rectangle(w / 2, h / 2, Math.min(720, w - 60), 380, 0x1e1e26, 1);
    panel.setStrokeStyle(2, 0x444444, 1);

    const title = this.add.text(w / 2, h / 2 - 150, 'Street Selling — Fictional Interaction', {
      fontSize: '24px', color: '#f0f0f0', fontFamily: 'monospace', align: 'center',
    }).setOrigin(0.5);

    const tip = this.add.text(w / 2, h / 2 - 110, 'Choose a number to sell. Price varies by area. Heat rises with activity.', {
      fontSize: '14px', color: '#9aa0a6', fontFamily: 'monospace', align: 'center', wordWrap: { width: Math.min(700, w - 80), useAdvancedWrap: true },
    }).setOrigin(0.5);

    this.input.keyboard.addKey('ESC');

    this.quantity = 1;
    this.pricePerUnit = this.getPriceForLocation();

    this.quantityText = this.add.text(w / 2, h / 2 - 20, `Quantity: ${this.quantity}`, { fontSize: '18px', color: '#f0f0f0', fontFamily: 'monospace' }).setOrigin(0.5);
    this.priceText = this.add.text(w / 2, h / 2 + 20, `Price: $${this.pricePerUnit} each`, { fontSize: '18px', color: '#f0f0f0', fontFamily: 'monospace' }).setOrigin(0.5);

    const minus = this.add.text(w / 2 - 120, h / 2 - 20, '−', { fontSize: '32px', color: '#8bd3ff', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const plus = this.add.text(w / 2 + 120, h / 2 - 20, '+', { fontSize: '32px', color: '#8bd3ff', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const sellBtn = this.add.text(w / 2, h / 2 + 90, 'Sell', { fontSize: '22px', color: '#5bd38f', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const cancelBtn = this.add.text(w / 2, h / 2 + 130, 'Cancel', { fontSize: '16px', color: '#ff6b6b', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    minus.on('pointerdown', () => this.adjust(-1));
    plus.on('pointerdown', () => this.adjust(1));
    sellBtn.on('pointerdown', () => this.sell());
    cancelBtn.on('pointerdown', () => this.exit());
  }

  adjust(delta) {
    const max = Math.max(0, Math.min(5, GameState.productInventory));
    this.quantity = Phaser.Math.Clamp(this.quantity + delta, 0, max);
    this.quantityText.setText(`Quantity: ${this.quantity}`);
  }

  sell() {
    if (this.quantity <= 0 || GameState.productInventory <= 0) {
      this.exit();
      return;
    }
    const qty = Math.min(this.quantity, GameState.productInventory);
    const revenue = qty * this.pricePerUnit;
    GameState.productInventory -= qty;
    GameState.money += revenue;
    GameState.soldUnits += qty;
    GameState.heat = Phaser.Math.Clamp(GameState.heat + qty * 2 + Phaser.Math.Between(0, 4), 0, GAMEPLAY.heatMax);
    const unlockMsg = GameState.tryUnlocks();

    // Show quick toast
    const toast = this.add.text(this.scale.width / 2, this.scale.height / 2 + 160, `Sold ${qty} for $${revenue}.` + (unlockMsg ? `\n${unlockMsg}` : ''), {
      fontSize: '16px', color: '#f0f0f0', fontFamily: 'monospace', align: 'center',
    }).setOrigin(0.5);

    this.time.delayedCall(800, () => {
      toast.destroy();
      this.exit();
    });
  }

  exit() {
    this.scene.stop();
    this.scene.resume('WorldScene');
  }

  getPriceForLocation() {
    const zone = (GameState.location || 'Desert').toLowerCase();
    const base = GAMEPLAY.basePrice[zone] || 50;
    const surge = Phaser.Math.Between(-5, 12);
    return base + surge;
  }
}
