import './style.css'

import { dragAndDrop } from './drag-and-drop';

document.getElementById('app')!.innerHTML = `
<div class="work-zone">
<div class="block" id="block-1"></div>
<div class="block" id="block-2"></div>
</div>
`;

dragAndDrop(document.getElementById('block-1')!, 150, 300);
dragAndDrop(document.getElementById('block-2')!, 550, 300);
