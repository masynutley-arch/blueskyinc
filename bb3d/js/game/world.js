import { WORLD } from '../shared/constants.js';

export function createWorld(scene) {
  const zoneMeshes = {};

  // Ground plane
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: WORLD.size, height: WORLD.size, subdivisions: 1 }, scene);
  const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.56, 0.49, 0.34);
  ground.material = groundMat;

  // Simple colored tiles indicating zones
  function makeZone(name, x, z, w, h, color) {
    const mesh = BABYLON.MeshBuilder.CreateGround(`zone-${name}`, { width: w, height: h, subdivisions: 1 }, scene);
    mesh.position.x = x;
    mesh.position.z = z;
    const mat = new BABYLON.StandardMaterial(`mat-${name}`, scene);
    mat.diffuseColor = color;
    mat.alpha = 0.5;
    mesh.material = mat;
    zoneMeshes[name] = mesh;
  }

  makeZone('desert', 0, 0, 2200, 3000, new BABYLON.Color3(0.76, 0.66, 0.44));
  makeZone('ghetto', 1500, 900, 1800, 1500, new BABYLON.Color3(0.36, 0.36, 0.36));
  makeZone('suburbs', 2800, -700, 800, 1500, new BABYLON.Color3(0.36, 0.66, 0.48));
  makeZone('city', 3800, 700, 1000, 1500, new BABYLON.Color3(0.24, 0.34, 0.48));

  // Minimal buildings: RV, shop boxes
  const rv = BABYLON.MeshBuilder.CreateBox('rv', { width: 2.4, height: 1.4, depth: 4.6 }, scene);
  rv.position = new BABYLON.Vector3(-20, 0.7, -60);
  const rvMat = new BABYLON.StandardMaterial('rvMat', scene);
  rvMat.diffuseColor = new BABYLON.Color3(0.89, 0.88, 0.82);
  rv.material = rvMat;

  const gunShop = BABYLON.MeshBuilder.CreateBox('gunShop', { width: 10, height: 5, depth: 8 }, scene);
  gunShop.position = new BABYLON.Vector3(60, 2.5, -20);
  const shopMat = new BABYLON.StandardMaterial('shopMat', scene);
  shopMat.diffuseColor = new BABYLON.Color3(0.5, 0.3, 0.3);
  gunShop.material = shopMat;

  return { zoneMeshes, rv, gunShop };
}
