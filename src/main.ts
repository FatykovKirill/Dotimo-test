import './style.css';
import { dragAndDrop } from './drag-and-drop';
import type { BlockData } from './interface';

let activeBox: HTMLElement | null = null;

document.getElementById('app')!.innerHTML = `
<div class="work-zone">
  <div class="block" id="block-1" data-color="color-1"></div>
  <div class="block" id="block-2" data-color="color-2"></div>

  <div class="choose-color">
    <h2 inert>Выбери цвет</h2>
    <div class="choose-color__items" id="colorPalette">
      <div class="color-btn" data-color="color-1"></div>
      <div class="color-btn" data-color="color-2"></div>
      <div class="color-btn" data-color="color-3"></div>
    </div>

		<button id="unbindBtn" class="unbind-btn">Разъединить</button>
  </div>
</div>
`;

export function setActiveBox(blockEl: HTMLElement) {
	clearActiveBox();

	const currentBlockData = [block1Data, block2Data].find(b => b.element === blockEl);

	if (currentBlockData && currentBlockData.groupId) {

		[block1Data, block2Data].forEach(b => {
			if (b.groupId === currentBlockData.groupId) {
				b.element.classList.add('block-active');
			}
		});
	} else {

		blockEl.classList.add('block-active');
	}

	activeBox = blockEl;
}

function clearActiveBox(): void {
	document.querySelectorAll('.block').forEach(e => e.classList.remove('block-active'));
	activeBox = null;
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

function unbindBlocks(block1: BlockData, block2: BlockData) {

	block1.groupId = null;
	block2.groupId = null;

	const diffX = Math.abs(block1.x - block2.x);
	const diffY = Math.abs(block1.y - block2.y);

	const GAP = 25;


	if (diffX > diffY) {

		if (block1.x < block2.x) {
			block1.x = Math.max(0, block1.x - GAP / 2);
			block2.x = Math.min(700, block2.x + GAP / 2);
		} else {
			block1.x = Math.min(700, block1.x + GAP / 2);
			block2.x = Math.max(0, block2.x - GAP / 2);
		}
	} else {

		if (block1.y < block2.y) {
			block1.y = Math.max(0, block1.y - GAP / 2);
			block2.y = Math.min(700, block2.y + GAP / 2);
		} else {
			block1.y = Math.min(700, block1.y + GAP / 2);
			block2.y = Math.max(0, block2.y - GAP / 2);
		}
	}


	block1.element.style.transform = `translate3d(${block1.x}px, ${block1.y}px, 0)`;
	block2.element.style.transform = `translate3d(${block2.x}px, ${block2.y}px, 0)`;
}

const block1El = document.getElementById('block-1')!;
const block2El = document.getElementById('block-2')!;

export const block1Data: BlockData = {
	id: 'block-1',
	element: block1El,
	x: 100,
	y: 100,
	size: 100,
	groupId: null
};

export const block2Data: BlockData = {
	id: 'block-2',
	element: block2El,
	x: 300,
	y: 100,
	size: 100,
	groupId: null
};

dragAndDrop(block1Data, setActiveBox, () => block2Data);
dragAndDrop(block2Data, setActiveBox, () => block1Data);


const unbindBtn = document.getElementById('unbindBtn');

unbindBtn?.addEventListener('click', () => {
	unbindBlocks(block1Data, block2Data);
});