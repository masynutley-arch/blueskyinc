import { GameState } from '../shared/state.js';

export function createCookingLab(overlayEl, { onCompleteBatch }) {
  const modal = document.createElement('div');
  modal.className = 'disclaimer';
  modal.style.display = 'none';

  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.minWidth = '720px';

  const title = document.createElement('h3'); title.textContent = 'RV Lab — Fictional Mixing';
  const note = document.createElement('div'); note.textContent = 'Drag colorful shapes into the flask in any order. This is purely fictional and not based on real processes or equipment.';

  const board = document.createElement('div');
  board.style.display = 'grid';
  board.style.gridTemplateColumns = 'repeat(6, 1fr)';
  board.style.gap = '8px';
  board.style.margin = '12px 0';

  const slotArea = document.createElement('div');
  slotArea.style.display = 'flex';
  slotArea.style.gap = '12px';
  slotArea.style.flexWrap = 'wrap';

  const shapes = [
    { id: 'blue', label: 'Blue Crystal', color: '#5dbdf7' },
    { id: 'yellow', label: 'Sunny Powder', color: '#ffd166' },
    { id: 'purple', label: 'Mystery Droplet', color: '#c77dff' },
    { id: 'green', label: 'Fizz Cube', color: '#80ed99' },
    { id: 'red', label: 'Spicy Shard', color: '#ff6b6b' },
  ];

  const beaker = document.createElement('div');
  beaker.className = 'panel';
  beaker.textContent = 'Flask';
  beaker.style.height = '180px';
  beaker.style.display = 'flex';
  beaker.style.alignItems = 'center';
  beaker.style.justifyContent = 'center';
  beaker.style.borderStyle = 'dashed';

  const shapeEls = shapes.map(s => {
    const el = document.createElement('div');
    el.className = 'btn';
    el.textContent = s.label;
    el.style.background = s.color;
    el.draggable = true;
    el.ondragstart = (e) => e.dataTransfer.setData('text/plain', s.id);
    return el;
  });

  shapeEls.forEach(el => board.append(el));

  beaker.ondragover = (e) => { e.preventDefault(); };
  const added = [];
  beaker.ondrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    added.push(id);
    const chip = document.createElement('div'); chip.className = 'btn'; chip.textContent = id; chip.style.opacity = '0.8';
    beaker.append(chip);
  };

  const condenserToggle = document.createElement('div'); condenserToggle.className = 'btn'; condenserToggle.textContent = 'Attach Condenser (fictional): OFF';
  let condenserOn = false; condenserToggle.onclick = () => { condenserOn = !condenserOn; condenserToggle.textContent = `Attach Condenser (fictional): ${condenserOn ? 'ON' : 'OFF'}`; };
  const reflux = document.createElement('div'); reflux.className = 'btn'; reflux.textContent = 'Start Reflux (fictional)'; reflux.onclick = () => mix();
  const finish = document.createElement('div'); finish.className = 'btn'; finish.textContent = 'Finish'; finish.onclick = () => close();

  panel.append(title, note, board, beaker, condenserToggle, reflux, finish);
  modal.append(panel);
  overlayEl.append(modal);

  function mix() {
    // Fictional scoring: any combination yields between 3..8 units
    let base = Math.floor(added.length * (2 + Math.random()));
    if (condenserOn) base += 1; // tiny fictional bonus
    const units = Math.min(8, Math.max(3, base));
    onCompleteBatch?.(units);
    const msg = document.createElement('div'); msg.textContent = `Batch complete: +${units} units (fictional).`; panel.append(msg);
  }

  function open() { modal.style.display = 'flex'; }
  function close() { modal.style.display = 'none'; }
  return { open, close };
}
