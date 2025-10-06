import { createGame } from './game/game.js';

const canvas = document.getElementById('renderCanvas');
const overlay = document.getElementById('overlay');
const disclaimer = document.getElementById('disclaimer');
const continueBtn = document.getElementById('continueBtn');

continueBtn.addEventListener('click', async () => {
  disclaimer.style.display = 'none';
  await createGame(canvas, overlay);
});
