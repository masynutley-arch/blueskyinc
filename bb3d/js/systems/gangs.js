export function createGangSystem(scene, player) {
  const thugs = [];

  function spawnThug(x, z) {
    const mesh = BABYLON.MeshBuilder.CreateSphere('thug', { diameter: 1 }, scene);
    mesh.position = new BABYLON.Vector3(x, 0.5, z);
    const mat = new BABYLON.StandardMaterial('thugMat', scene);
    mat.diffuseColor = new BABYLON.Color3(0.8, 0.1, 0.1);
    mesh.material = mat;
    thugs.push({ mesh, state: 'wander', timer: 0 });
  }

  for (let i = 0; i < 12; i++) spawnThug(Math.random() * 400 - 200, Math.random() * 400 - 200);

  function update() {
    const dt = scene.getEngine().getDeltaTime() / 1000;
    thugs.forEach((t) => {
      const toPlayer = player.position.subtract(t.mesh.position);
      const dist = toPlayer.length();
      if (dist < 8) {
        // Harass and increase heat when near
        t.mesh.position.addInPlace(toPlayer.normalize().scale(1.5 * dt));
      } else {
        t.mesh.position.x += Math.sin((t.timer += dt)) * 0.2 * dt * 60;
        t.mesh.position.z += Math.cos(t.timer) * 0.15 * dt * 60;
      }
    });
  }

  return { update };
}
