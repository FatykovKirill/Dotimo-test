import type { BlockData } from "./interface";

export function dragAndDrop(
	blockData: BlockData,
	onSelect: (block: HTMLElement) => void,
	getOtherBlockData: () => BlockData
) {
	let active: boolean = false;

	let lastMouseX: number = 0;
	let lastMouseY: number = 0;

	const { element } = blockData;

	element.style.transform = `translate3d(${blockData.x}px, ${blockData.y}px, 0)`;

	element.addEventListener('pointerdown', (e) => {
		element.setPointerCapture(e.pointerId);

		lastMouseX = e.clientX;
		lastMouseY = e.clientY;

		active = true;
		onSelect(element);
	});

	element.addEventListener('pointermove', (e) => {
		if (!active) return;

		const dx = e.clientX - lastMouseX;
		const dy = e.clientY - lastMouseY;


		lastMouseX = e.clientX;
		lastMouseY = e.clientY;

		const otherBlock = getOtherBlockData();

		if (blockData.groupId && blockData.groupId === otherBlock.groupId) {
			moveBlock(blockData, dx, dy);
			moveBlock(otherBlock, dx, dy);
			return;
		}

		moveBlock(blockData, dx, dy);

		const snappedCoords = checkSnap(blockData, otherBlock);

		blockData.x = snappedCoords.x;
		blockData.y = snappedCoords.y;
		element.style.transform = `translate3d(${blockData.x}px, ${blockData.y}px, 0)`;
	});

	function stopDragging(e: PointerEvent) {
		if (!active) return;
		active = false;
		element.releasePointerCapture(e.pointerId);
	}

	element.addEventListener('pointerup', stopDragging);
	element.addEventListener('pointercancel', stopDragging);
}

function moveBlock(block: BlockData, dx: number, dy: number) {
	const BOARD_SIZE = 800;
	const BLOCK_SIZE = block.size ?? 100;
	const MAX_POS = BOARD_SIZE - BLOCK_SIZE;

	let newX = block.x + dx;
	let newY = block.y + dy;

	block.x = Math.max(0, Math.min(newX, MAX_POS));
	block.y = Math.max(0, Math.min(newY, MAX_POS));

	block.element.style.transform = `translate3d(${block.x}px, ${block.y}px, 0)`;
}

function checkSnap(boxA: BlockData, boxB: BlockData) {
	const SNAP_THRESHOLD = 20;

	const sizeA = boxA.size ?? 100;
	const sizeB = boxB.size ?? 100;

	const isOverlapY = boxA.y + sizeA > boxB.y && boxA.y < boxB.y + sizeB;
	const isOverlapX = boxA.x + sizeA > boxB.x && boxA.x < boxB.x + sizeB;

	let snappedX = boxA.x;
	let snappedY = boxA.y;
	let isSnapped = false;

	if (isOverlapY) {
		if (Math.abs(boxA.x - (boxB.x + sizeB)) <= SNAP_THRESHOLD) {
			snappedX = boxB.x + sizeB;
			isSnapped = true;
		} else if (Math.abs((boxA.x + sizeA) - boxB.x) <= SNAP_THRESHOLD) {
			snappedX = boxB.x - sizeA;
			isSnapped = true;
		}
	}

	if (isOverlapX) {
		if (Math.abs(boxA.y - (boxB.y + sizeB)) <= SNAP_THRESHOLD) {
			snappedY = boxB.y + sizeB;
			isSnapped = true;
		} else if (Math.abs((boxA.y + sizeA) - boxB.y) <= SNAP_THRESHOLD) {
			snappedY = boxB.y - sizeA;
			isSnapped = true;
		}
	}

	if (isSnapped) {
		const sharedGroupId = boxB.groupId || boxA.groupId || `group_${Date.now()}`;
		boxA.groupId = sharedGroupId;
		boxB.groupId = sharedGroupId;
	}

	return { x: snappedX, y: snappedY };
}