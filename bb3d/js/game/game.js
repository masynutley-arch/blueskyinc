import { GameState } from '../shared/state.js';
import { WORLD, GAMEPLAY } from '../shared/constants.js';
import { createWorld } from './world.js';
import { createPlayerController } from './player.js';
import { createHUD } from '../ui/hud.js';
import { createPoliceSystem } from '../systems/police.js';
import { createGangSystem } from '../systems/gangs.js';
import { createGunStore } from '../ui/gunStore.js';
import { createCookingLab } from '../minigames/cookingLab.js';

export async function createGame(canvas, overlayEl) {
  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.08, 1);

  const camera = new BABYLON.UniversalCamera('cam', new BABYLON.Vector3(0, 2, -6), scene);
  camera.attachControl(canvas, true);
  camera.speed = 0.4;

  const light = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.9;

  // Ground and zones
  const { zoneMeshes, rv, gunShop } = createWorld(scene);

  // Player controller
  const player = createPlayerController(scene, camera);

  // Systems
  const police = createPoliceSystem(scene, player);
  const gangs = createGangSystem(scene, player);

  // UI
  const hud = createHUD(scene, overlayEl, {
    onOpenGunStore: () => {
      if (BABYLON.Vector3.Distance(player.position, gunShop.position) < 10) {
        gunStore.open();
      } else {
        police.pushAlert('Move closer to the gun store.');
      }
    },
    onOpenCooking: () => {
      if (GameState.selectedCharacter !== 'walter') {
        police.pushAlert('Walter handles the RV lab.');
      } else if (BABYLON.Vector3.Distance(player.position, rv.position) < 12) {
        cooking.open();
      } else {
        police.pushAlert('The RV lab is not nearby.');
      }
    },
    getAlerts: () => police.alerts,
  });
  const gunStore = createGunStore(overlayEl, { onBuy: (item, cost) => { if (GameState.money >= cost) { GameState.money -= cost; /* add to inventory */ } } });
  const cooking = createCookingLab(overlayEl, {
    onCompleteBatch: (units) => {
      GameState.cookedUnits += units;
      GameState.productInventory += units;
      GameState.tryUnlocks();
    }
  });

  // Curfew lighting
  scene.registerBeforeRender(() => {
    GameState.tickTime(engine.getDeltaTime() / 1000);
    const hour = GameState.timeOfDay;
    const isNight = hour >= GAMEPLAY.curfewStartHour || hour < GAMEPLAY.curfewEndHour;
    light.intensity = isNight ? 0.5 : 0.9;
    police.updateCurfew(isNight);
  });

  engine.runRenderLoop(() => {
    scene.render();
    hud.update();
    police.update();
    gangs.update();
  });

  window.addEventListener('resize', () => engine.resize());

  return { engine, scene };
}
