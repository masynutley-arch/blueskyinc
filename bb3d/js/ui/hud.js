import { GameState } from '../shared/state.js';
import { GAMEPLAY } from '../shared/constants.js';

export function createHUD(scene, overlayEl, actions) {
  overlayEl.innerHTML = '';
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.position = 'absolute';
  panel.style.top = '12px';
  panel.style.left = '12px';
  panel.style.pointerEvents = 'auto';

  const info = document.createElement('div');
  const alerts = document.createElement('div');
  alerts.style.marginTop = '6px';
  const btnRow = document.createElement('div');
  const cookBtn = document.createElement('div'); cookBtn.className = 'btn'; cookBtn.textContent = 'RV Lab'; cookBtn.onclick = () => actions.onOpenCooking?.();
  const shopBtn = document.createElement('div'); shopBtn.className = 'btn'; shopBtn.textContent = 'Gun Store'; shopBtn.onclick = () => actions.onOpenGunStore?.();
  btnRow.append(cookBtn, shopBtn);
  panel.append(info, alerts, btnRow);
  overlayEl.append(panel);

  function update() {
    const t = GameState.timeOfDay;
    const hour = Math.floor(t).toString().padStart(2, '0');
    const min = Math.floor((t % 1) * 60).toString().padStart(2, '0');
    const curfew = (t >= GAMEPLAY.curfewStartHour || t < GAMEPLAY.curfewEndHour) ? 'Curfew Active' : 'Curfew Off';
    info.textContent = `Time ${hour}:${min} | $${GameState.money.toFixed(0)} | Inv ${GameState.productInventory} | Heat ${GameState.heat.toFixed(0)}% | ${curfew}`;
    const activeAlerts = actions.getAlerts?.() || [];
    alerts.innerHTML = activeAlerts.map(a => `<div style="color:#ffcf5d">${a.text}</div>`).join('');
  }

  return { update };
}
