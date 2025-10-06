import { GameState } from '../shared/state.js';
import { COLORS, ZONES } from '../shared/constants.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    this.text = this.add.text(12, 8, '', {
      fontSize: '14px', color: COLORS.uiText, fontFamily: 'monospace',
    }).setScrollFactor(0);

    this.hints = this.add.text(12, 28, '', {
      fontSize: '12px', color: COLORS.neutral, fontFamily: 'monospace',
    }).setScrollFactor(0);

    this.input.keyboard.on('keydown', (e) => {
      if (e.key.toLowerCase() === 'h') {
        this.showHelp();
      }
    });

    this.helpVis = false;
    this.helpBox = this.add.container().setScrollFactor(0);
    this.helpPanel = this.add.rectangle(12 + 310, 12 + 130, 620, 260, 0x0f0f12, 0.9).setOrigin(0.5).setStrokeStyle(2, 0x333333);
    this.helpText = this.add.text(12 + 40, 12 + 30, this.buildHelpText(), { fontSize: '14px', color: COLORS.uiText, fontFamily: 'monospace', wordWrap: { width: 560 } });
    this.helpBox.add([this.helpPanel, this.helpText]);
    this.helpBox.setVisible(false);

    this.time.addEvent({ delay: 150, loop: true, callback: () => this.updateHUD() });
  }

  updateHUD() {
    const zoneLockInfo = `Suburbs: ${GameState.unlocked.suburbs ? 'Unlocked' : 'Locked'} | City: ${GameState.unlocked.city ? 'Unlocked' : 'Locked'}`;
    this.text.setText(`Role: ${GameState.selectedCharacter || '-'} | $${GameState.money.toFixed(0)} | Inv ${GameState.productInventory} | Heat ${GameState.heat.toFixed(0)}% | ${zoneLockInfo}`);

    const inDesert = GameState.location === 'Desert';
    const canCook = inDesert && GameState.selectedCharacter === 'walter';
    const canSell = GameState.selectedCharacter === 'jesse';

    const lines = [
      'WASD/Arrows: Move — H: Help',
      canCook ? 'Near RV: C to open cooking minigame' : '',
      canSell ? 'V: Street selling popup (needs inventory)' : 'Selling is handled by Jesse',
      `Current Area: ${GameState.location}`,
    ].filter(Boolean);

    this.hints.setText(lines.join('\n'));
  }

  showHelp() {
    this.helpVis = !this.helpVis;
    this.helpBox.setVisible(this.helpVis);
  }

  buildHelpText() {
    const lines = [
      'Blue Desert — Fictional Free-Roam (New Mexico setting)',
      '',
      'Goal: Explore desert and neighborhoods. Cook (Walter) or sell (Jesse).',
      'Unlock Suburbs and City by accumulating fictional “units” cooked and sold.',
      '',
      'Controls:',
      ' - Move: WASD or Arrow Keys',
      ' - Interact: C (cook at RV if Walter), V (sell as Jesse)',
      ' - Help: H',
      '',
      'Notes:',
      ' - Mechanics are intentionally vague and not realistic.',
      ' - No real-life processes depicted. This is satire and fiction.',
      '',
      'Zones:',
      ` - Desert: ${ZONES.desert.width}x${ZONES.desert.height} start area with RV`,
      ' - Ghetto: entry-level buyers; modest prices',
      ' - Suburbs: unlock after progress; better prices',
      ' - City: unlock later; highest prices',
    ];
    return lines.join('\n');
  }
}
