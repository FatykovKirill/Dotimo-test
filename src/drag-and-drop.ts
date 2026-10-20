export function dragAndDrop(block: HTMLElement,
	initialX: number = 0,
	initialY: number = 0,
) {
	let active: boolean = false;
	// Click position
	let startX: number = 0,
		startY: number = 0;

	// Position cube
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
		block.classList.add('block-active');
	});

	block.addEventListener('pointermove', (e) => {

		if (!active) return
		offsetX = (e.clientX - startX) + currentX;
		offsetY = (e.clientY - startY) + currentY;

		// Work place size
		const BOARD_SIZE = 800;
		const CUBE_SIZE = 100;
		const MAX_POS = BOARD_SIZE - CUBE_SIZE;

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
		block.classList.remove('block-active');
	}

	block.addEventListener('pointerup', stopDragging);
	block.addEventListener('pointercancel', stopDragging);
};