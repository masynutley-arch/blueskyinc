import { GAMEPLAY } from '../shared/constants.js';

export function createPlayerController(scene, camera) {
  const player = new BABYLON.TransformNode('player', scene);
  camera.parent = player;
  camera.position = new BABYLON.Vector3(0, 2, -6);

  // Simple capsule proxy
  const capsule = BABYLON.MeshBuilder.CreateCapsule('playerCapsule', { height: 1.8, radius: 0.4 }, scene);
  capsule.parent = player;
  capsule.isPickable = false;

  const keys = { w: false, a: false, s: false, d: false, shift: false };
  window.addEventListener('keydown', e => { if (e.key) { const k = e.key.toLowerCase(); if (k in keys) keys[k] = true; if (k === 'shift') keys.shift = true; } });
  window.addEventListener('keyup', e => { if (e.key) { const k = e.key.toLowerCase(); if (k in keys) keys[k] = false; if (k === 'shift') keys.shift = false; } });

  const forward = new BABYLON.Vector3(0, 0, 1);
  const right = new BABYLON.Vector3(1, 0, 0);

  scene.onBeforeRenderObservable.add(() => {
    const dt = scene.getEngine().getDeltaTime() / 1000;
    const speed = GAMEPLAY.moveSpeed * (keys.shift ? GAMEPLAY.sprintMultiplier : 1);

    const dir = new BABYLON.Vector3(0, 0, 0);
    const camForward = camera.getDirection(forward);
    const camRight = camera.getDirection(right);
    camForward.y = 0; camRight.y = 0; camForward.normalize(); camRight.normalize();

    if (keys.w) dir.addInPlace(camForward);
    if (keys.s) dir.addInPlace(camForward.scale(-1));
    if (keys.a) dir.addInPlace(camRight.scale(-1));
    if (keys.d) dir.addInPlace(camRight);

    if (!dir.equalsWithEpsilon(BABYLON.Vector3.Zero())) {
      dir.normalize();
      player.position.addInPlace(dir.scale(speed * dt));
    }
  });

  return player;
}
