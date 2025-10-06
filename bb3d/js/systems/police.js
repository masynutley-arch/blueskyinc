import { GameState } from '../shared/state.js';

export function createPoliceSystem(scene, player) {
  const cops = [];
  const alerts = [];
  let curfewActive = false;

  function spawnCop(x, z) {
    const mesh = BABYLON.MeshBuilder.CreateBox('cop', { size: 1 }, scene);
    mesh.position = new BABYLON.Vector3(x, 0.5, z);
    const mat = new BABYLON.StandardMaterial('copMat', scene);
    mat.diffuseColor = new BABYLON.Color3(0.1, 0.2, 0.9);
    mesh.material = mat;
    cops.push({ mesh, state: 'patrol', timer: 0 });
  }

  // Initial cops
  for (let i = 0; i < 8; i++) spawnCop(Math.random() * 200 - 100, Math.random() * 200 - 100);

  function update() {
    const dt = scene.getEngine().getDeltaTime() / 1000;
    cops.forEach((c) => {
      const toPlayer = player.position.subtract(c.mesh.position);
      const dist = toPlayer.length();
      const seePlayer = dist < 20 && (curfewActive || GameState.heat > 30);
      if (seePlayer) {
        c.state = 'chase';
        c.mesh.position.addInPlace(toPlayer.normalize().scale(3 * dt));
        pushAlert('Police noticed suspicious activity!');
        if (dist < 2) {
          arrest();
        }
      } else {
        c.state = 'patrol';
        c.mesh.position.x += Math.sin((c.timer += dt)) * 0.4 * dt * 60;
        c.mesh.position.z += Math.cos(c.timer) * 0.3 * dt * 60;
      }
    });

    // Fade alerts
    alerts.forEach((a) => a.life -= dt);
    while (alerts.length && alerts[0].life <= 0) alerts.shift();
  }

  function pushAlert(text) {
    if (!alerts.length || alerts[alerts.length - 1].text !== text) alerts.push({ text, life: 2.0 });
  }

  function arrest() {
    GameState.arrested = true;
    GameState.heat = Math.max(0, GameState.heat - 30);
    // Simple penalty
    GameState.money = Math.max(0, GameState.money - 200);
    pushAlert('You were arrested. Fined $200.');
  }

  function updateCurfew(active) {
    curfewActive = active;
  }

  return { update, updateCurfew, alerts, pushAlert };
}
