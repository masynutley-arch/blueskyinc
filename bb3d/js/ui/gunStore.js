import { GameState } from '../shared/state.js';

export function createGunStore(overlayEl, { onBuy }) {
  const modal = document.createElement('div');
  modal.className = 'disclaimer';
  modal.style.display = 'none';

  const panel = document.createElement('div');
  panel.className = 'panel';
  const title = document.createElement('h3'); title.textContent = 'Gun Store';
  const list = document.createElement('div');
  const items = [
    { id: 'pistol', name: 'Pistol (cosmetic)', cost: 300 },
    { id: 'smg', name: 'SMG (cosmetic)', cost: 900 },
    { id: 'armor', name: 'Armor Vest', cost: 500 },
  ];
  items.forEach(it => {
    const row = document.createElement('div');
    const btn = document.createElement('div'); btn.className = 'btn'; btn.textContent = `Buy ${it.name} — $${it.cost}`; btn.onclick = () => { onBuy?.(it.id, it.cost); close(); };
    row.append(btn);
    list.append(row);
  });
  const closeBtn = document.createElement('div'); closeBtn.className = 'btn'; closeBtn.textContent = 'Close'; closeBtn.onclick = () => close();
  panel.append(title, list, closeBtn);
  modal.append(panel);
  overlayEl.append(modal);

  function open() { modal.style.display = 'flex'; }
  function close() { modal.style.display = 'none'; }
  return { open, close };
}
