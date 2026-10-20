export function dragAndDrop(block: HTMLElement,
	initialX: number = 0,
	initialY: number = 0,
	onSelect: (block: HTMLElement) => void,
) {
	let active: boolean = false;
	// Click position
	let startX: number = 0,
		startY: number = 0;

	// Position block
	let currentX: number = initialX,
		currentY: number = initialY;

	// Poistion in move
	let offsetX: number = initialX,
		offsetY: number = initialY;


	block.style.transform = "translate3d(" + offsetX + "px, " + offsetY + "px, 0)";

	block.addEventListener('pointerdown', (e) => {
		block.setPointerCapture(e.pointerId);

		startX = e.clientX;
		startY = e.clientY;

		active = true;
		onSelect(block);
	});

	block.addEventListener('pointermove', (e) => {

		if (!active) return
		offsetX = (e.clientX - startX) + currentX;
		offsetY = (e.clientY - startY) + currentY;

		// Work place size
		const BOARD_SIZE = 800;
		const BLOCK_SIZE = 100;
		const MAX_POS = BOARD_SIZE - BLOCK_SIZE;

		// Formule limit zone
		offsetX = Math.max(0, Math.min(offsetX, MAX_POS));
		offsetY = Math.max(0, Math.min(offsetY, MAX_POS));

		block.style.transform = "translate3d(" + offsetX + "px, " + offsetY + "px, 0)";
	});

	function stopDragging() {
		if (!active) return;

		currentX = offsetX;
		currentY = offsetY;

		active = false;
	}

	block.addEventListener('pointerup', stopDragging);
	block.addEventListener('pointercancel', stopDragging);
};