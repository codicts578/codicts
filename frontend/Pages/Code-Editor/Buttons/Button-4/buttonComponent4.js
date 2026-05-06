(function() {
// DOM elements
const liveButton = document.getElementById('liveButton');
const textOverlay = document.getElementById('textOverlay');
const btnWrapper = document.getElementById('gradientButtonWrapper');
const btnBgColor = document.getElementById('btnBgColor');
const btnTextColor = document.getElementById('btnTextColor');
const btnLabel = document.getElementById('btnLabel');
const borderRadius = document.getElementById('borderRadius');
const paddingX = document.getElementById('paddingX');
const paddingY = document.getElementById('paddingY');
const paddingXVal = document.getElementById('paddingXVal');
const paddingYVal = document.getElementById('paddingYVal');
const fontSize = document.getElementById('fontSize');

const codeEditor = document.getElementById('codeEditor');
const syncFromCodeBtn = document.getElementById('syncFromCodeBtn');
const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
const exportCodeBtn = document.getElementById('exportCodeBtn');
const syncStatusSpan = document.getElementById('syncStatus');

let currentPlatform = 'web';
let isUpdatingFromCode = false;
let isUpdatingFromDesign = false;

function showToastMessage(msg, isError = false) {
    const existingToast = document.querySelector('.toast-msg');
    if(existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.style.color = isError ? '#f87171' : '#e2e8f0';
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function getDesign() {
    return {
        bgColor: btnBgColor.value,
        textColor: btnTextColor.value,
        label: btnLabel.value || "Button",
        radius: borderRadius.value,
        padX: paddingX.value + 'px',
        padY: paddingY.value + 'px',
        fontSize: fontSize.value,
    };
}

function escapeHtml(str) { return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }
function escapeXml(str) { return str.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[m]); }

// Apply design changes to preview with perfect fidelity
function applyDesign() {
    if (isUpdatingFromCode) return;
    isUpdatingFromDesign = true;
    const d = getDesign();
    
    btnWrapper.style.setProperty('--rad', d.radius);
    btnWrapper.style.setProperty('--color-btn-bg', d.bgColor);
    btnWrapper.style.setProperty('--color-btn-text', d.textColor);
    btnWrapper.style.setProperty('--color-overlay-text', d.textColor);
    btnWrapper.style.fontSize = d.fontSize;
    
    liveButton.innerText = d.label;
    liveButton.style.padding = `${d.padY} ${d.padX}`;
    
    if (textOverlay) {
        textOverlay.innerText = d.label;
        textOverlay.style.padding = `${d.padY} ${d.padX}`;
        textOverlay.style.color = d.textColor;
        textOverlay.style.textShadow = `0 0 6px ${d.textColor === '#000000' ? '#ffffff' : '#ffffff'}`;
    }
    
    isUpdatingFromDesign = false;
    updateCodeForPlatform();
    updateSyncStatus('design updated');
}

// ========== PLATFORM-SPECIFIC CODE GENERATORS (FULLY FUNCTIONAL) ==========
function generateWebCode() {
    const d = getDesign();
    return `<!-- Gradient Animated Button - Web Component -->
<div class="btn-wrapper" style="--rad:${d.radius}; --color-btn-bg:${d.bgColor}; --color-btn-text:${d.textColor}; --color-overlay-text:${d.textColor}; font-size:${d.fontSize};">
<div class="light"></div>
<div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div>
<button class="gradient-btn" style="padding:${d.padY} ${d.padX};">${escapeHtml(d.label)}</button>
<div class="text-overlay" style="padding:${d.padY} ${d.padX};">${escapeHtml(d.label)}</div>
</div>
<style>
.btn-wrapper{position:relative;display:inline-flex;align-items:center;justify-content:center;overflow:clip;border:2px solid #fff;border-radius:var(--rad);font-family:'Inter',sans-serif;font-weight:600;filter:saturate(0.65) brightness(1.8);}
.gradient-btn{position:relative;z-index:-1;border:none;border-radius:var(--rad);font:inherit;letter-spacing:0.15rem;color:var(--color-btn-text);background-color:var(--color-btn-bg);box-shadow:inset 0 0 10px 9px #558;text-shadow:0 1px 3px #fff;mix-blend-mode:color-dodge;cursor:pointer;}
.text-overlay{position:absolute;pointer-events:none;z-index:2;border-radius:var(--rad);font:inherit;color:var(--color-overlay-text);text-shadow:0 0 4px #fff;box-shadow:inset 0 -4px 4px #0004, inset 0 4px 4px #fff5;mix-blend-mode:multiply;animation:opacityPulse 5s infinite;}
.gradient-layer{position:absolute;pointer-events:none;left:-160px;width:500%;aspect-ratio:1;background:radial-gradient(ellipse at 65% 180%,#fff,#00f,#fff,#00f,#fff,#00f,#fff,#00f,#fff,#00f,#fff);mix-blend-mode:difference;animation:rotate 8s linear infinite;}
.light{position:absolute;z-index:1;width:80%;height:1.9rem;background:#fff5;filter:blur(5px);animation:pulse 3s infinite;}
@keyframes rotate{100%{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.1;}}
@keyframes opacityPulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
.btn-wrapper:hover .text-overlay{transform:scale(1.05);}
.btn-wrapper:hover .gradient-btn{color:#0000;text-shadow:none;}
</style>`;
}

function generateReactCode() {
    const d = getDesign();
    return `// GradientButton.tsx - React Component
import React from 'react';
import './GradientButton.css';

interface GradientButtonProps {
label?: string;
bgColor?: string;
textColor?: string;
borderRadius?: string;
paddingX?: string;
paddingY?: string;
fontSize?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
label = "${escapeHtml(d.label)}",
bgColor = "${d.bgColor}",
textColor = "${d.textColor}",
borderRadius = "${d.radius}",
paddingX = "${d.padX}",
paddingY = "${d.padY}",
fontSize = "${d.fontSize}",
}) => {
return (
<div className="btn-wrapper" style={{
'--rad': borderRadius,
'--color-btn-bg': bgColor,
'--color-btn-text': textColor,
'--color-overlay-text': textColor,
fontSize: fontSize,
} as React.CSSProperties}>
<div className="light"></div>
{[...Array(7)].map((_, i) => <div key={i} className="gradient-layer"></div>)}
<button className="gradient-btn" style={{ padding: \`\${paddingY} \${paddingX}\` }}>{label}</button>
<div className="text-overlay" style={{ padding: \`\${paddingY} \${paddingX}\` }}>{label}</div>
</div>
);
};
export default GradientButton;
/* Add corresponding CSS from the web version in GradientButton.css */`;
}

function generateAndroidCode() {
    const d = getDesign();
    const radiusDp = d.radius === '32px' ? '32' : d.radius === '8px' ? '8' : d.radius === '16px' ? '16' : d.radius === '30px' ? '30' : '50';
    return `<!-- Android XML Layout - Gradient Button Style -->
<!-- res/drawable/gradient_button_bg.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
<solid android:color="${d.bgColor}"/>
<stroke android:width="2dp" android:color="#FFFFFF"/>
<corners android:radius="${radiusDp}dp"/>
</shape>

<!-- res/layout/activity_main.xml -->
<Button
android:id="@+id/gradientBtn"
android:layout_width="wrap_content"
android:layout_height="wrap_content"
android:text="${escapeXml(d.label)}"
android:textColor="${d.textColor}"
android:textSize="${parseInt(d.fontSize)}sp"
android:paddingLeft="${parseInt(d.padX)}dp"
android:paddingRight="${parseInt(d.padX)}dp"
android:paddingTop="${parseInt(d.padY)}dp"
android:paddingBottom="${parseInt(d.padY)}dp"
android:background="@drawable/gradient_button_bg"
android:letterSpacing="0.15" />

<!-- For animated gradient effect, use AnimatedVectorDrawable or custom animation -->`;
}

function generateTkinterCode() {
    const d = getDesign();
    return `# Python Tkinter - Gradient Style Button
import tkinter as tk

root = tk.Tk()
root.title("Gradient Button")
root.configure(bg='#0b1120')

def on_enter(e):
e.widget.config(bg="#0F1C53")
def on_leave(e):
e.widget.config(bg="${d.bgColor}")

btn = tk.Button(
root,
text="${escapeXml(d.label)}",
fg="${d.textColor}",
bg="${d.bgColor}",
font=("Inter", ${parseInt(d.fontSize)}),
relief="solid",
bd=2,
highlightcolor="#FFFFFF",
highlightbackground="#FFFFFF",
padx=${parseInt(d.padX)},
pady=${parseInt(d.padY)},
cursor="hand2",
activebackground="#0F1C53",
activeforeground="${d.textColor}"
)
btn.bind("<Enter>", on_enter)
btn.bind("<Leave>", on_leave)
btn.place(relx=0.5, rely=0.5, anchor="center")
root.geometry("400x200")
root.mainloop()
# Full gradient animation can be achieved with canvas.radial gradient and after() loop.`;
}

function updateCodeForPlatform() {
    if (isUpdatingFromCode) return;
    let code = '';
    if (currentPlatform === 'web') code = generateWebCode();
    else if (currentPlatform === 'react') code = generateReactCode();
    else if (currentPlatform === 'android') code = generateAndroidCode();
    else if (currentPlatform === 'tkinter') code = generateTkinterCode();
    codeEditor.value = code;
}

function updateSyncStatus(msg) {
    syncStatusSpan.textContent = `✓ ${msg}`;
    setTimeout(() => { if(syncStatusSpan.textContent.includes(msg)) syncStatusSpan.textContent = '✓ live sync'; }, 1500);
}

function syncDesignFromCode() {
    if (currentPlatform !== 'web') {
        showToastMessage('Switch to Web tab for sync-to-design feature', true);
        return;
    }
    if (isUpdatingFromDesign) return;
    isUpdatingFromCode = true;
    const txt = codeEditor.value;
    const bgMatch = txt.match(/--color-btn-bg:\s*([^;]+);/);
    const textMatch = txt.match(/--color-overlay-text:\s*([^;]+);/);
    const radiusMatch = txt.match(/--rad:\s*([^;]+);/);
    const labelMatch = txt.match(/<button[^>]*>([^<]+)<\/button>/);
    const fontSizeMatch = txt.match(/font-size:\s*([^;]+);/);
    if (bgMatch) btnBgColor.value = bgMatch[1].trim();
    if (textMatch) btnTextColor.value = textMatch[1].trim();
    if (radiusMatch) borderRadius.value = radiusMatch[1].trim();
    if (labelMatch && labelMatch[1]) btnLabel.value = labelMatch[1].trim();
    if (fontSizeMatch) fontSize.value = fontSizeMatch[1].trim();
    applyDesign();
    setTimeout(() => { 
        isUpdatingFromCode = false; 
        updateSyncStatus('code → design');
        showToastMessage('Design synced from Web code'); 
    }, 50);
}

function exportCodeFile() {
    const code = codeEditor.value;
    let ext = 'txt';
    if (currentPlatform === 'web') ext = 'html';
    else if (currentPlatform === 'react') ext = 'tsx';
    else if (currentPlatform === 'android') ext = 'xml';
    else if (currentPlatform === 'tkinter') ext = 'py';
    const blob = new Blob([code], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gradient_button.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToastMessage(`📁 ${ext.toUpperCase()} file exported successfully`);
}

// Event listeners
btnBgColor.addEventListener('input', applyDesign);
btnTextColor.addEventListener('input', applyDesign);
btnLabel.addEventListener('input', applyDesign);
borderRadius.addEventListener('change', applyDesign);
fontSize.addEventListener('change', applyDesign);
paddingX.addEventListener('input', () => { paddingXVal.textContent = paddingX.value + 'px'; applyDesign(); });
paddingY.addEventListener('input', () => { paddingYVal.textContent = paddingY.value + 'px'; applyDesign(); });

liveButton.addEventListener('click', () => alert('✨ Interactive Preview — Text always crisp! Hover for animations.'));
syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
copyFinalCodeBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(codeEditor.value);
    copyFinalCodeBtn.innerText = '✓ Copied!';
    setTimeout(() => copyFinalCodeBtn.innerText = 'Copy Code', 1500);
    showToastMessage('Code copied to clipboard');
});
exportCodeBtn.addEventListener('click', exportCodeFile);

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPlatform = btn.getAttribute('data-platform');
        updateCodeForPlatform();
    });
});

applyDesign();
})();