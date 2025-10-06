import { WORLD, ZONES, GAMEPLAY, START_POSITIONS } from '../shared/constants.js';
import { GameState } from '../shared/state.js';

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });
  }

  create() {
    // World size
    this.cameras.main.setBackgroundColor('#201f2b');
    this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height);

    // Create simple ground zones as colored rectangles
    this.zoneGfx = this.add.graphics();
    this.zoneLabels = [];
    this.drawZones();

    // Create gates between zones (simple lines)
    this.createGates();

    // Player
    const start = GameState.selectedCharacter === 'walter' ? START_POSITIONS.walter : START_POSITIONS.jesse;
    this.player = this.physics.add.sprite(start.x, start.y, GameState.selectedCharacter === 'walter' ? 'player-blue' : 'player-orange');
    this.player.body.setSize(24, 24).setOffset(4, 4);
    this.player.setCollideWorldBounds(true);

    // RV static object in desert
    this.rv = this.physics.add.staticSprite(500, 1400, 'rv');

    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      E: Phaser.Input.Keyboard.KeyCodes.E, // interact
      C: Phaser.Input.Keyboard.KeyCodes.C, // cook
      V: Phaser.Input.Keyboard.KeyCodes.V, // sell
    });

    // NPCs for selling
    this.npcs = this.add.group();
    this.npcTimer = this.time.addEvent({ delay: GAMEPLAY.npcSpawnIntervalMs, loop: true, callback: () => this.spawnNpc() });

    // UI
    this.scene.run('UIScene');

    // Overlaps
    this.physics.add.overlap(this.player, this.rv, () => {
      this.canCook = true;
    });

    // Simple zone names overlay
    this.zoneNameText = this.add.text(16, 16, '', {
      fontSize: '16px', fill: '#f0f0f0', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3,
    }).setScrollFactor(0);

    this.updateLocationLabel();

    // When returning from modals (cooking/selling), refresh visuals and gates
    this.events.on('resume', () => {
      this.drawZones();
      this.updateGatesForUnlocks();
      this.updateLocationLabel();
    });
  }

  drawZones() {
    this.zoneGfx.clear();
    if (this.zoneLabels && this.zoneLabels.length) {
      this.zoneLabels.forEach((l) => l.destroy());
      this.zoneLabels = [];
    }
    Object.values(ZONES).forEach((z) => {
      const isLocked = (z.key === 'suburbs' && !GameState.unlocked.suburbs) || (z.key === 'city' && !GameState.unlocked.city);
      const color = isLocked ? 0x333333 : z.color;
      this.zoneGfx.fillStyle(color, 1);
      this.zoneGfx.fillRect(z.x, z.y, z.width, z.height);
      // borders
      this.zoneGfx.lineStyle(2, 0x000000, 0.4);
      this.zoneGfx.strokeRect(z.x, z.y, z.width, z.height);

      // zone labels
      const label = this.add.text(z.x + z.width / 2, z.y + 24, z.name + (isLocked ? ' (Locked)' : ''), {
        fontSize: '18px', color: '#ffffff', fontFamily: 'monospace', stroke: '#000', strokeThickness: 4,
      }).setOrigin(0.5, 0);
      label.setAlpha(0.5);
      this.zoneLabels.push(label);
    });
  }

  createGates() {
    // Gates are simple invisible rectangles that prevent entry to locked zones
    this.gates = this.physics.add.staticGroup();

    const addGate = (x, y, w, h, zoneKey) => {
      const gate = this.add.rectangle(x, y, w, h, 0xff0000, 0); // invisible barrier
      this.physics.add.existing(gate, true);
      gate.zoneKey = zoneKey;
      this.gates.add(gate);
    };

    // Suburbs gate along the boundary at x=2200 (top half of map)
    addGate(2200, 750, 20, 1500, 'suburbs');
    // City gate
    addGate(3000, 750, 20, 1500, 'city');

    this.physics.add.collider(this.player, this.gates, (player, gate) => {
      const zone = ZONES[gate.zoneKey];
      const unlocked = gate.zoneKey === 'suburbs' ? GameState.unlocked.suburbs : GameState.unlocked.city;
      if (!unlocked) {
        // Bounce back
        player.body.velocity.scale(0);
        player.x = Phaser.Math.Clamp(player.x, 0, WORLD.width);
        player.y = Phaser.Math.Clamp(player.y, 0, WORLD.height);
        this.showHint(`${zone.name} is locked. Progress by cooking and selling.`);
      }
    });

    this.updateGatesForUnlocks();
  }

  update(time, delta) {
    if (!this.player) return;

    GameState.maybeDecayHeat(delta);

    // Movement
    const speed = GAMEPLAY.moveSpeed;
    let vx = 0; let vy = 0;
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;

    if (left) vx -= speed;
    if (right) vx += speed;
    if (up) vy -= speed;
    if (down) vy += speed;

    this.player.setVelocity(vx, vy);

    // Interactions
    const nearRV = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.rv.x, this.rv.y) < 100;

    if (Phaser.Input.Keyboard.JustDown(this.keys.C) && nearRV && GameState.selectedCharacter === 'walter') {
      this.scene.pause();
      this.scene.launch('CookingScene');
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.V)) {
      if (GameState.selectedCharacter !== 'jesse') {
        this.showHint('Jesse handles selling.');
      } else if (GameState.productInventory <= 0) {
        this.showHint('No inventory to sell.');
      } else {
        this.scene.pause();
        this.scene.launch('SellingScene');
      }
    }

    // Update location
    this.updateLocationLabel();
  }

  showHint(text) {
    if (this.hintText) this.hintText.destroy();
    this.hintText = this.add.text(this.player.x, this.player.y - 40, text, {
      fontSize: '14px', color: '#ffcf5d', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);
    this.time.delayedCall(1500, () => this.hintText?.destroy());
  }

  updateLocationLabel() {
    const p = { x: this.player.x, y: this.player.y };
    let label = 'Desert';
    if (this.pointInZone(p, ZONES.ghetto)) label = 'Ghetto';
    if (GameState.unlocked.suburbs && this.pointInZone(p, ZONES.suburbs)) label = 'Suburbs';
    if (GameState.unlocked.city && this.pointInZone(p, ZONES.city)) label = 'City';
    GameState.location = label;
    this.zoneNameText.setText(`Location: ${label} | $${GameState.money.toFixed(0)} | Heat ${GameState.heat.toFixed(0)}% | Inv ${GameState.productInventory}`);
  }

  pointInZone(p, z) {
    return p.x >= z.x && p.x <= z.x + z.width && p.y >= z.y && p.y <= z.y + z.height;
  }

  spawnNpc() {
    if (this.npcs.getChildren().length >= GAMEPLAY.npcMax) return;

    // Spawn around player within same zone only
    const spawnDist = 400;
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const x = this.player.x + Math.cos(angle) * spawnDist;
    const y = this.player.y + Math.sin(angle) * spawnDist;
    if (x < 0 || y < 0 || x > WORLD.width || y > WORLD.height) return;

    const npc = this.physics.add.sprite(x, y, 'npc');
    npc.setData('wants', Phaser.Math.Between(1, 4));
    npc.setData('price', this.getPriceForZone(GameState.location));
    this.npcs.add(npc);

    // Move slowly toward player
    this.physics.moveToObject(npc, this.player, 40);

    this.physics.add.overlap(this.player, npc, () => {
      const msg = GameState.selectedCharacter === 'jesse' ? 'Press V to sell' : 'Jesse handles selling';
      this.showHint(msg);
    });
  }

  getPriceForZone(zone) {
    const mult = Phaser.Math.FloatBetween(0.9, 1.2);
    const base = GAMEPLAY.basePrice[zone.toLowerCase()] || 50;
    return Math.round(base * mult);
  }

  updateGatesForUnlocks() {
    if (!this.gates) return;
    this.gates.getChildren().forEach((gate) => {
      const unlocked = gate.zoneKey === 'suburbs' ? GameState.unlocked.suburbs : GameState.unlocked.city;
      if (gate.body) gate.body.enable = !unlocked;
      gate.active = !unlocked;
    });
  }
}
