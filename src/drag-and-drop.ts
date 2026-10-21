import type { BlockData } from "./interface";

export function dragAndDrop(
	block: HTMLElement,
	blockData: BlockData,
	onSelect: (block: HTMLElement) => void,
	getOtherBlockData: () => BlockData
) {
	let active: boolean = false;

	let startX: number = 0,
		startY: number = 0;


	let currentX: number = blockData.x,
		currentY: number = blockData.y;

	let offsetX: number = blockData.x,
		offsetY: number = blockData.y;

	block.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;

	block.addEventListener('pointerdown', (e) => {
		block.setPointerCapture(e.pointerId);

		startX = e.clientX;
		startY = e.clientY;

		active = true;
		onSelect(block);
	});

	block.addEventListener('pointermove', (e) => {
		if (!active) return;

		offsetX = (e.clientX - startX) + currentX;
		offsetY = (e.clientY - startY) + currentY;

		const BOARD_SIZE = 800;
		const BLOCK_SIZE = blockData.size ?? 100;
		const MAX_POS = BOARD_SIZE - BLOCK_SIZE;


		offsetX = Math.max(0, Math.min(offsetX, MAX_POS));
		offsetY = Math.max(0, Math.min(offsetY, MAX_POS));

		const boxA: BlockData = { x: offsetX, y: offsetY, size: BLOCK_SIZE };
		const boxB: BlockData = getOtherBlockData();

		const snappedCoords = checkSnap(boxA, boxB);

		offsetX = snappedCoords.x;
		offsetY = snappedCoords.y;

		blockData.x = offsetX;
		blockData.y = offsetY;

		block.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
	});

	function stopDragging() {
		if (!active) return;

		currentX = offsetX;
		currentY = offsetY;

		blockData.x = currentX;
		blockData.y = currentY;

		active = false;
	}

	block.addEventListener('pointerup', stopDragging);
	block.addEventListener('pointercancel', stopDragging);
}

function checkSnap(
	boxA: BlockData,
	boxB: BlockData
) {
	const SNAP_THRESHOLD = 20;

	const sizeA = boxA.size ?? 100;
	const sizeB = boxB.size ?? 100;

	const isOverlapY = boxA.y + sizeA > boxB.y && boxA.y < boxB.y + sizeB;
	const isOverlapX = boxA.x + sizeA > boxB.x && boxA.x < boxB.x + sizeB;

	if (isOverlapY) {
		if (Math.abs(boxA.x - (boxB.x + sizeB)) <= SNAP_THRESHOLD) {
			console.log('Прилипли СПРАВА');
			return { x: boxB.x + sizeB, y: boxA.y };
		}

		if (Math.abs((boxA.x + sizeA) - boxB.x) <= SNAP_THRESHOLD) {
			console.log('Прилипли СЛЕВА');
			return { x: boxB.x - sizeA, y: boxA.y };
		}
	}

	if (isOverlapX) {
		if (Math.abs(boxA.y - (boxB.y + sizeB)) <= SNAP_THRESHOLD) {
			console.log('Прилипли СНИЗУ');
			return { x: boxA.x, y: boxB.y + sizeB };
		}

		if (Math.abs((boxA.y + sizeA) - boxB.y) <= SNAP_THRESHOLD) {
			console.log('Прилипли СВЕРХУ');
			return { x: boxA.x, y: boxB.y - sizeA };
		}
	}

	return { x: boxA.x, y: boxA.y };
}