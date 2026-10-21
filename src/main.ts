import './style.css';
import { dragAndDrop } from './drag-and-drop';
import type { BlockData } from './interface';

let activeBox: HTMLElement | null = null;

document.getElementById('app')!.innerHTML = `
<div class="work-zone">
  <div class="block" id="block-1" data-color="color-1"></div>
  <div class="block" id="block-2" data-color="color-2"></div>

  <div class="choose-color">
    <h2>Выбери цвет</h2>
    <div class="choose-color__items" id="colorPalette">
      <div class="color-btn" data-color="color-1"></div>
      <div class="color-btn" data-color="color-2"></div>
      <div class="color-btn" data-color="color-3"></div>
    </div>
  </div>
</div>
`;

function clearActiveBox(): void {
	document.querySelectorAll('.block').forEach(e => e.classList.remove('block-active'));
	activeBox = null;
}

export function setActiveBox(block: HTMLElement) {
	clearActiveBox();
	block.classList.add('block-active');
	activeBox = block;
}

const board = document.querySelector<HTMLElement>('.work-zone');

board?.addEventListener('click', (e) => {
	const target = e.target as HTMLElement;
	if (target === board) {
		clearActiveBox();
	}
});

const palette = document.getElementById('colorPalette');

palette?.addEventListener('click', (e) => {
	const target = e.target as HTMLElement;

	if (target.classList.contains('color-btn')) {
		const selectedColor = target.dataset.color;

		if (activeBox && selectedColor) {
			activeBox.dataset.color = selectedColor;
		}
	}
});

const block1El = document.getElementById('block-1')!;
const block2El = document.getElementById('block-2')!;

const block1Data: BlockData = { x: 100, y: 100, size: 100 };
const block2Data: BlockData = { x: 300, y: 100, size: 100 };

dragAndDrop(block1El, block1Data, setActiveBox, () => block2Data);
dragAndDrop(block2El, block2Data, setActiveBox, () => block1Data);