
(function () {
// Safe selector helper
const $ = (id) => document.getElementById(id);

const cardBg = $('cardBg');
const borderClr = $('borderClr');
const textClr = $('textClr');
const animSpeed = $('animSpeed');
const cardHeight = $('cardHeight');
const text1 = $('text1');
const text2 = $('text2');
const text3 = $('text3');

const expandCard = $('expandCard');
const codeEditor = $('codeEditor');
const copyBtn = $('copyFinalCodeBtn');
const exportCodeBtn = $('exportCodeBtn');
const exportImageBtn = $('exportImageBtn');
const syncStatus = $('syncStatus');

let currentPlatform = 'web';

// Guard: stop if critical elements missing
if (!expandCard || !codeEditor) return;

const getItems = () => document.querySelectorAll('.expand-card__item');
const getSpans = () => [
$('span1'),
$('span2'),
$('span3')
];

// Debounce
let debounceTimer;
function debounce(fn, delay = 100) {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(fn, delay);
}

function applyCardDesign() {
const items = getItems();
const spans = getSpans();

expandCard.style.backgroundColor = cardBg?.value || '#fff';
expandCard.style.height = (cardHeight?.value || 300) + 'px';

items.forEach(item => {
    item.style.backgroundColor = cardBg?.value;
    item.style.borderColor = borderClr?.value;
    item.style.transition = `all ${animSpeed?.value || 0.3}s cubic-bezier(0.4,0,0.2,1)`;
});

spans.forEach((span, i) => {
    if (!span) return;
    span.style.color = textClr?.value;
    span.style.transition = `all ${animSpeed?.value || 0.3}s cubic-bezier(0.4,0,0.2,1)`;
});

if (spans[0]) spans[0].textContent = text1?.value || '';
if (spans[1]) spans[1].textContent = text2?.value || '';
if (spans[2]) spans[2].textContent = text3?.value || '';

updateCode();
updateStatus('✓ design updated');
}

function updateStatus(msg) {
if (!syncStatus) return;
syncStatus.textContent = msg;
setTimeout(() => {
    syncStatus.textContent = '✓ ready';
}, 1500);
}

// ---------------- CODE GENERATION ----------------

function generateWebCode() {
return `<!-- Expand Card -->
<style>
.expand-card {
display:flex;
gap:5px;
padding:.4em;
max-width:350px;
height:${cardHeight.value}px;
background:${cardBg.value};
}

.expand-card__item {
flex:1;
border:1px solid ${borderClr.value};
display:flex;
justify-content:center;
align-items:center;
transition:all ${animSpeed.value}s ease;
}

.expand-card__item:hover { flex:4; }

.expand-card__item span {
transform:rotate(-90deg);
color:${textClr.value};
transition:all ${animSpeed.value}s ease;
}

.expand-card__item:hover span {
transform:rotate(0);
}
</style>

<div class="expand-card">
<div class="expand-card__item"><span>${text1.value}</span></div>
<div class="expand-card__item"><span>${text2.value}</span></div>
<div class="expand-card__item"><span>${text3.value}</span></div>
</div>`;
}

function updateCode() {
if (!codeEditor) return;
codeEditor.value = generateWebCode();
}

// ---------------- ACTIONS ----------------

async function copyCode() {
try {
    await navigator.clipboard.writeText(codeEditor.value);
    copyBtn.innerText = '✅ Copied!';
    updateStatus('✓ copied');
} catch {
    alert('Copy failed. Use HTTPS.');
}

setTimeout(() => {
    copyBtn.innerText = '📋 Copy Code';
}, 1500);
}

function exportCodeFile() {
const blob = new Blob([codeEditor.value], { type: 'text/plain' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'expand_card.html';
a.click();
URL.revokeObjectURL(a.href);

updateStatus('✓ exported');
}

async function exportPNG() {
if (!window.html2canvas) {
    alert('html2canvas not loaded');
    return;
}

const canvas = await window.html2canvas(expandCard, { scale: 2 });
const link = document.createElement('a');
link.download = 'card.png';
link.href = canvas.toDataURL();
link.click();

updateStatus('✓ image saved');
}

// ---------------- EVENTS ----------------

const inputs = [cardBg, borderClr, textClr, animSpeed, cardHeight, text1, text2, text3];

inputs.forEach(el => {
el?.addEventListener('input', () => debounce(applyCardDesign));
});

copyBtn?.addEventListener('click', copyCode);
exportCodeBtn?.addEventListener('click', exportCodeFile);
exportImageBtn?.addEventListener('click', exportPNG);

// Init
applyCardDesign();
})();