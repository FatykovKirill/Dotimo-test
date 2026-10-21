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

		moveBlock(blockData, otherBlock, dx, dy, onSelect);
	});

	function stopDragging(e: PointerEvent) {
		if (!active) return;
		active = false;
		element.releasePointerCapture(e.pointerId);
	}

	element.addEventListener('pointerup', stopDragging);
	element.addEventListener('pointercancel', stopDragging);
}

function moveBlock(
	blockA: BlockData,
	blockB: BlockData,
	dx: number,
	dy: number,
	onSelect: (block: HTMLElement) => void
) {
	const BOARD_SIZE = 800;
	const BLOCK_SIZE = 100;
	const MAX_POS = BOARD_SIZE - BLOCK_SIZE;

	if (blockA.groupId && blockA.groupId === blockB.groupId) {
		const nextA_X = blockA.x + dx;
		const nextA_Y = blockA.y + dy;
		const nextB_X = blockB.x + dx;
		const nextB_Y = blockB.y + dy;

		const canMoveX =
			nextA_X >= 0 && nextA_X <= MAX_POS &&
			nextB_X >= 0 && nextB_X <= MAX_POS;

		const canMoveY =
			nextA_Y >= 0 && nextA_Y <= MAX_POS &&
			nextB_Y >= 0 && nextB_Y <= MAX_POS;

		if (canMoveX) {
			blockA.x = nextA_X;
			blockB.x = nextB_X;
		}

		if (canMoveY) {
			blockA.y = nextA_Y;
			blockB.y = nextB_Y;
		}

		blockA.element.style.transform = `translate3d(${blockA.x}px, ${blockA.y}px, 0)`;
		blockB.element.style.transform = `translate3d(${blockB.x}px, ${blockB.y}px, 0)`;
	} else {

		let rawX = blockA.x + dx;
		let rawY = blockA.y + dy;

		rawX = Math.max(0, Math.min(rawX, MAX_POS));
		rawY = Math.max(0, Math.min(rawY, MAX_POS));

		const snappedCoords = checkSnap(blockA, blockB, rawX, rawY, onSelect);

		blockA.x = snappedCoords.x;
		blockA.y = snappedCoords.y;

		blockA.element.style.transform = `translate3d(${blockA.x}px, ${blockA.y}px, 0)`;
	}
}

function checkSnap(
	boxA: BlockData,
	boxB: BlockData,
	candidateX: number,
	candidateY: number,
	onSelect: (block: HTMLElement) => void
) {
	const SNAP_THRESHOLD = 20;

	const sizeA = boxA.size ?? 100;
	const sizeB = boxB.size ?? 100;

	const isOverlapY = candidateY + sizeA > boxB.y && candidateY < boxB.y + sizeB;
	const isOverlapX = candidateX + sizeA > boxB.x && candidateX < boxB.x + sizeB;

	let snappedX = candidateX;
	let snappedY = candidateY;
	let isSnapped = false;

	if (isOverlapY) {
		if (Math.abs(candidateX - (boxB.x + sizeB)) <= SNAP_THRESHOLD) {
			snappedX = boxB.x + sizeB;
			isSnapped = true;
		} else if (Math.abs((candidateX + sizeA) - boxB.x) <= SNAP_THRESHOLD) {
			snappedX = boxB.x - sizeA;
			isSnapped = true;
		}
	}

	if (isOverlapX) {
		if (Math.abs(candidateY - (boxB.y + sizeB)) <= SNAP_THRESHOLD) {
			snappedY = boxB.y + sizeB;
			isSnapped = true;
		} else if (Math.abs((candidateY + sizeA) - boxB.y) <= SNAP_THRESHOLD) {
			snappedY = boxB.y - sizeA;
			isSnapped = true;
		}
	}

	if (isSnapped) {
		const sharedGroupId = boxB.groupId || boxA.groupId || `group_${Date.now()}`;
		boxA.groupId = sharedGroupId;
		boxB.groupId = sharedGroupId;


		onSelect(boxA.element);
	}

	return { x: snappedX, y: snappedY };
}