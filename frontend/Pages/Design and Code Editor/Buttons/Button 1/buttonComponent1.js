(function() {
// DOM elements
const liveButton = document.getElementById('liveButton');
const btnBgColor = document.getElementById('btnBgColor');
const btnTextColor = document.getElementById('btnTextColor');
const btnLabel = document.getElementById('btnLabel');
const borderRadius = document.getElementById('borderRadius');
const paddingX = document.getElementById('paddingX');
const paddingY = document.getElementById('paddingY');
const paddingXVal = document.getElementById('paddingXVal');
const paddingYVal = document.getElementById('paddingYVal');
const fontSize = document.getElementById('fontSize');
const hoverEffect = document.getElementById('hoverEffect');

const codeEditor = document.getElementById('codeEditor');
const syncFromCodeBtn = document.getElementById('syncFromCodeBtn');
const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
const exportCodeBtn = document.getElementById('exportCodeBtn');
const syncStatusSpan = document.getElementById('syncStatus');

let currentPlatform = 'web';
let isUpdatingFromCode = false;
let isUpdatingFromDesign = false;

paddingX.addEventListener('input', () => { paddingXVal.textContent = paddingX.value + 'px'; applyDesign(); });
paddingY.addEventListener('input', () => { paddingYVal.textContent = paddingY.value + 'px'; applyDesign(); });

function getDesign() {
    return {
        bgColor: btnBgColor.value,
        textColor: btnTextColor.value,
        label: btnLabel.value,
        radius: borderRadius.value,
        padX: paddingX.value + 'px',
        padY: paddingY.value + 'px',
        fontSize: fontSize.value,
        hover: hoverEffect.value
    };
}

function getHoverCSS(hover, bgColor) {
    if(hover === 'glitch') {
        return `/* Glitch Effect */
button::after {
--move1: inset(50% 50% 50% 50%);
--move2: inset(31% 0 40% 0);
--move3: inset(39% 0 15% 0);
--move4: inset(45% 0 40% 0);
--move5: inset(45% 0 6% 0);
--move6: inset(14% 0 61% 0);
clip-path: var(--move1);
content: '${escapeHtml(btnLabel.value)}';
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
display: block;
}
button:hover::after {
animation: glitch_4011 1s;
text-shadow: -3px -3px 0px #1df2f0, 3px 3px 0px #E94BE8;
}
button:hover {
text-shadow: -1px -1px 0px #1df2f0, 1px 1px 0px #E94BE8;
border: 1px solid rgb(0, 255, 213);
}
@keyframes glitch_4011 {
0% { clip-path: var(--move1); transform: translate(0px,-10px); }
10% { clip-path: var(--move2); transform: translate(-10px,10px); }
20% { clip-path: var(--move3); transform: translate(10px,0px); }
30% { clip-path: var(--move4); transform: translate(-10px,10px); }
40% { clip-path: var(--move5); transform: translate(10px,-10px); }
50% { clip-path: var(--move6); transform: translate(-10px,10px); }
60% { clip-path: var(--move1); transform: translate(10px,-10px); }
70% { clip-path: var(--move3); transform: translate(-10px,10px); }
80% { clip-path: var(--move2); transform: translate(10px,-10px); }
90% { clip-path: var(--move4); transform: translate(-10px,10px); }
100% { clip-path: var(--move1); transform: translate(0); }
}`;
    }
    switch(hover) {
        case 'lift': return 'transform: translateY(-3px); filter: brightness(1.05);';
        case 'scale': return 'transform: scale(1.05);';
        case 'darken': return 'filter: brightness(0.9);';
        case 'glow': return `box-shadow: 0 0 15px ${bgColor}; filter: brightness(1.1);`;
        default: return '';
    }
}

// ========== WEB GENERATOR with Glitch Support ==========
function generateWebCode() {
    const d = getDesign();
    const hoverCss = getHoverCSS(d.hover, d.bgColor);
    if(d.hover === 'glitch') {
        return `<!-- Glitch Button Component -->
<button class="custom-button" id="actionButton">${escapeHtml(d.label)}</button>

<style>
.custom-button {
background: ${d.bgColor};
color: ${d.textColor};
border: none;
border-radius: ${d.radius};
padding: ${d.padY} ${d.padX};
font-size: ${d.fontSize};
font-weight: 600;
cursor: pointer;
transition: all 0.2s ease;
font-family: system-ui, 'Segoe UI', sans-serif;
position: relative;
}

.custom-button::after {
--move1: inset(50% 50% 50% 50%);
--move2: inset(31% 0 40% 0);
--move3: inset(39% 0 15% 0);
--move4: inset(45% 0 40% 0);
--move5: inset(45% 0 6% 0);
--move6: inset(14% 0 61% 0);
clip-path: var(--move1);
content: '${escapeHtml(d.label)}';
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
display: block;
background-color: transparent;
}

.custom-button:hover::after {
animation: glitch_4011 1s;
text-shadow: -3px -3px 0px #1df2f0, 3px 3px 0px #E94BE8;
background-color: transparent;
}

.custom-button:hover {
text-shadow: -1px -1px 0px #1df2f0, 1px 1px 0px #E94BE8;
background-color: transparent;
border: 1px solid rgb(0, 255, 213);
box-shadow: 0px 10px 10px -10px rgb(0, 255, 213);
}

@keyframes glitch_4011 {
0% { clip-path: var(--move1); transform: translate(0px,-10px); }
10% { clip-path: var(--move2); transform: translate(-10px,10px); }
20% { clip-path: var(--move3); transform: translate(10px,0px); }
30% { clip-path: var(--move4); transform: translate(-10px,10px); }
40% { clip-path: var(--move5); transform: translate(10px,-10px); }
50% { clip-path: var(--move6); transform: translate(-10px,10px); }
60% { clip-path: var(--move1); transform: translate(10px,-10px); }
70% { clip-path: var(--move3); transform: translate(-10px,10px); }
80% { clip-path: var(--move2); transform: translate(10px,-10px); }
90% { clip-path: var(--move4); transform: translate(-10px,10px); }
100% { clip-path: var(--move1); transform: translate(0); }
}
</style>

<script>
document.getElementById('actionButton')?.addEventListener('click', () => {
alert('Glitch Button clicked!');
});
<\/script>`;
    }
    return `<!-- Web Button Component -->
<button class="custom-button" id="actionButton">${escapeHtml(d.label)}</button>

<style>
.custom-button {
background: ${d.bgColor};
color: ${d.textColor};
border: none;
border-radius: ${d.radius};
padding: ${d.padY} ${d.padX};
font-size: ${d.fontSize};
font-weight: 600;
cursor: pointer;
transition: all 0.2s ease;
font-family: system-ui, 'Segoe UI', sans-serif;
}
.custom-button:hover {
${hoverCss}
}
</style>

<script>
document.getElementById('actionButton')?.addEventListener('click', () => {
alert('Button clicked!');
});
<\/script>`;
}

// ========== REACT GENERATOR ==========
function generateReactCode() {
    const d = getDesign();
    if(d.hover === 'glitch') {
        return `// React + TypeScript Glitch Button Component
import React from 'react';
import './GlitchButton.css';

interface GlitchButtonProps {
onClick?: () => void;
children?: React.ReactNode;
}

const GlitchButton: React.FC<GlitchButtonProps> = ({ onClick, children }) => {
return (
<button 
    className="glitch-button"
    onClick={onClick}
>
    {children || "${escapeHtml(d.label)}"}
</button>
);
};

export default GlitchButton;

/* GlitchButton.css */
.glitch-button {
background: ${d.bgColor};
color: ${d.textColor};
border: none;
border-radius: ${d.radius};
padding: ${d.padY} ${d.padX};
font-size: ${d.fontSize};
font-weight: 600;
cursor: pointer;
position: relative;
}

.glitch-button::after {
--move1: inset(50% 50% 50% 50%);
--move2: inset(31% 0 40% 0);
--move3: inset(39% 0 15% 0);
--move4: inset(45% 0 40% 0);
--move5: inset(45% 0 6% 0);
--move6: inset(14% 0 61% 0);
clip-path: var(--move1);
content: '${escapeHtml(d.label)}';
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
display: block;
}

.glitch-button:hover::after {
animation: glitch_4011 1s;
text-shadow: -3px -3px 0px #1df2f0, 3px 3px 0px #E94BE8;
}

.glitch-button:hover {
text-shadow: -1px -1px 0px #1df2f0, 1px 1px 0px #E94BE8;
border: 1px solid rgb(0, 255, 213);
}

@keyframes glitch_4011 {
0% { clip-path: var(--move1); transform: translate(0px,-10px); }
10% { clip-path: var(--move2); transform: translate(-10px,10px); }
20% { clip-path: var(--move3); transform: translate(10px,0px); }
30% { clip-path: var(--move4); transform: translate(-10px,10px); }
40% { clip-path: var(--move5); transform: translate(10px,-10px); }
50% { clip-path: var(--move6); transform: translate(-10px,10px); }
60% { clip-path: var(--move1); transform: translate(10px,-10px); }
70% { clip-path: var(--move3); transform: translate(-10px,10px); }
80% { clip-path: var(--move2); transform: translate(10px,-10px); }
90% { clip-path: var(--move4); transform: translate(-10px,10px); }
100% { clip-path: var(--move1); transform: translate(0); }
}`;
    }
    const hoverCss = getHoverCSS(d.hover, d.bgColor);
    return `// React + TypeScript Button Component
import React from 'react';

interface CustomButtonProps {
onClick?: () => void;
children?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children }) => {
const buttonStyles: React.CSSProperties = {
background: "${d.bgColor}",
color: "${d.textColor}",
borderRadius: "${d.radius}",
padding: "${d.padY} ${d.padX}",
fontSize: "${d.fontSize}",
fontWeight: 600,
cursor: "pointer",
transition: "all 0.2s ease",
border: "none",
fontFamily: "system-ui, 'Segoe UI', sans-serif"
};

return (
<button 
    style={buttonStyles} 
    className="custom-button-react"
    onClick={onClick}
>
    {children || "${escapeHtml(d.label)}"}
</button>
);
};

export default CustomButton;

/* Add hover effect in CSS file */
/*
.custom-button-react:hover {
${hoverCss}
}
*/`;
}

function adjustBrightness(hex, percent) {
    let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    r = Math.min(255, Math.max(0, Math.floor(r * (1 + percent))));
    g = Math.min(255, Math.max(0, Math.floor(g * (1 + percent))));
    b = Math.min(255, Math.max(0, Math.floor(b * (1 + percent))));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function generateAndroidCode() {
    const d = getDesign();
    let padXDp = parseInt(d.padX);
    let padYDp = parseInt(d.padY);
    let radiusDp = parseInt(d.radius);
    let fontSizeSp = parseInt(d.fontSize);
    const hoverDark = adjustBrightness(d.bgColor, -0.15);
    const selectorXml = `<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
<item android:state_pressed="true">
    <shape android:shape="rectangle">
        <solid android:color="${hoverDark}" />
        <corners android:radius="${radiusDp}dp" />
    </shape>
</item>
<item>
    <shape android:shape="rectangle">
        <solid android:color="${d.bgColor}" />
        <corners android:radius="${radiusDp}dp" />
    </shape>
</item>
</selector>`;
    return `// Android Studio Button Component
// 1. Save as res/drawable/button_custom_bg.xml
${selectorXml}

// 2. Layout XML:
<Button
android:id="@+id/customButton"
android:layout_width="wrap_content"
android:layout_height="wrap_content"
android:text="${escapeXml(d.label)}"
android:textColor="${d.textColor}"
android:textSize="${fontSizeSp}sp"
android:paddingHorizontal="${padXDp}dp"
android:paddingVertical="${padYDp}dp"
android:background="@drawable/button_custom_bg"
android:fontFamily="sans-serif-medium" />

// 3. Activity (Kotlin):
// val button = findViewById<Button>(R.id.customButton)
// button.setOnClickListener { Toast.makeText(this, "Clicked", Toast.LENGTH_SHORT).show() }`;
}

function generateTkinterCode() {
    const d = getDesign();
    let padXInt = parseInt(d.padX);
    let padYInt = parseInt(d.padY);
    let fontSizeInt = parseInt(d.fontSize);
    const hoverDark = adjustBrightness(d.bgColor, -0.15);
    let hoverBind = '';
    if (d.hover === 'darken') {
        hoverBind = `    def on_enter(e): e.widget.config(bg="${hoverDark}")
def on_leave(e): e.widget.config(bg="${d.bgColor}")
btn.bind("<Enter>", on_enter)
btn.bind("<Leave>", on_leave)`;
    } else if (d.hover === 'lift') {
        hoverBind = `    def on_enter(e): e.widget.config(relief="raised", bd=2)
def on_leave(e): e.widget.config(relief="flat", bd=0)
btn.bind("<Enter>", on_enter)
btn.bind("<Leave>", on_leave)`;
    } else {
        hoverBind = `    # No hover effect`;
    }
    return `# Python Tkinter Button
import tkinter as tk

def create_button(parent, command=None):
btn = tk.Button(
    parent,
    text="${escapeXml(d.label)}",
    bg="${d.bgColor}",
    fg="${d.textColor}",
    font=("Segoe UI", ${fontSizeInt}, "bold"),
    padx=${padXInt},
    pady=${padYInt},
    relief="flat",
    bd=0,
    cursor="hand2",
    activebackground="${hoverDark}",
    activeforeground="${d.textColor}"
)
# Hover effect: ${d.hover}
${hoverBind}
if command:
    btn.config(command=command)
return btn

# Usage:
# root = tk.Tk()
# btn = create_button(root, lambda: print("Clicked"))
# btn.pack(pady=20)
# root.mainloop()`;
}

function escapeHtml(str) { return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }
function escapeXml(str) { return str.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[m]); }

function updateCodeForPlatform() {
    if (isUpdatingFromCode) return;
    let code = '';
    if (currentPlatform === 'web') code = generateWebCode();
    else if (currentPlatform === 'react') code = generateReactCode();
    else if (currentPlatform === 'android') code = generateAndroidCode();
    else if (currentPlatform === 'tkinter') code = generateTkinterCode();
    codeEditor.value = code;
}

function applyDesign() {
    if (isUpdatingFromCode) return;
    isUpdatingFromDesign = true;
    const d = getDesign();
    liveButton.style.backgroundColor = d.bgColor;
    liveButton.style.color = d.textColor;
    liveButton.style.borderRadius = d.radius;
    liveButton.style.padding = `${d.padY} ${d.padX}`;
    liveButton.style.fontSize = d.fontSize;
    
    // Ensure GLITCH text stays or update with user input
    if(d.label.trim() === "") {
        liveButton.innerText = "GLITCH";
    } else {
        liveButton.innerText = d.label;
    }
    
    // Update the ::after content dynamically
    const styleEl = document.getElementById('dynamic-glitch-style');
    if(styleEl) styleEl.remove();
    const newStyle = document.createElement('style');
    newStyle.id = 'dynamic-glitch-style';
    newStyle.textContent = `
        .live-button::after {
            content: '${liveButton.innerText}';
        }
    `;
    document.head.appendChild(newStyle);
    
    const hoverCss = getHoverCSS(d.hover, d.bgColor);
    let styleEl2 = document.getElementById('dynamic-hover-style');
    if (!styleEl2) { styleEl2 = document.createElement('style'); styleEl2.id = 'dynamic-hover-style'; document.head.appendChild(styleEl2); }
    styleEl2.textContent = `.live-button:hover { ${hoverCss} transition: all 0.2s ease; }`;
    
    // For glitch-specific hover styles
    if(d.hover === 'glitch') {
        styleEl2.textContent = `
            .live-button::after {
                content: '${liveButton.innerText}';
            }
            .live-button:hover::after {
                animation: glitch_4011 1s;
                text-shadow: -3px -3px 0px #1df2f0, 3px 3px 0px #E94BE8;
            }
            .live-button:hover {
                text-shadow: -1px -1px 0px #1df2f0, 1px 1px 0px #E94BE8;
                border: 1px solid rgb(0, 255, 213);
            }
        `;
    }
    
    isUpdatingFromDesign = false;
    updateCodeForPlatform();
    updateSyncStatus('design → code');
}

function syncDesignFromCode() {
    if (currentPlatform !== 'web') {
        syncStatusSpan.textContent = '⚠️ Sync only for Web tab';
        setTimeout(() => updateSyncStatus('live sync'), 1500);
        return;
    }
    if (isUpdatingFromDesign) return;
    isUpdatingFromCode = true;
    const txt = codeEditor.value;
    const bgMatch = txt.match(/background:\s*([^;]+);/);
    const colorMatch = txt.match(/color:\s*([^;]+);/);
    const radiusMatch = txt.match(/border-radius:\s*([^;]+);/);
    const paddingMatch = txt.match(/padding:\s*([^;]+);/);
    const fontSizeMatch = txt.match(/font-size:\s*([^;]+);/);
    const labelMatch = txt.match(/<button[^>]*>([^<]+)<\/button>/);
    if (bgMatch) btnBgColor.value = bgMatch[1].trim();
    if (colorMatch) btnTextColor.value = colorMatch[1].trim();
    if (radiusMatch) { let r = radiusMatch[1].trim(); if ([...borderRadius.options].some(o=>o.value===r)) borderRadius.value = r; }
    if (paddingMatch) { let pads = paddingMatch[1].trim().split(' '); if(pads.length===2){ let py=parseInt(pads[0]), px=parseInt(pads[1]); if(!isNaN(py)){paddingY.value=py; paddingYVal.textContent=py+'px'} if(!isNaN(px)){paddingX.value=px; paddingXVal.textContent=px+'px'} } }
    if (fontSizeMatch) { let fs = fontSizeMatch[1].trim(); if([...fontSize.options].some(o=>o.value===fs)) fontSize.value = fs; }
    if (labelMatch) btnLabel.value = labelMatch[1].trim();
    if (txt.includes('glitch') || txt.includes('GLITCH')) hoverEffect.value='glitch';
    else if (txt.includes('translateY')) hoverEffect.value='lift';
    else if (txt.includes('scale(1.05)')) hoverEffect.value='scale';
    else if (txt.includes('brightness(0.9)')) hoverEffect.value='darken';
    else if (txt.includes('box-shadow')) hoverEffect.value='glow';
    else hoverEffect.value='none';
    applyDesign();
    setTimeout(() => { isUpdatingFromCode = false; updateSyncStatus('code → design'); }, 30);
}

function updateSyncStatus(msg) {
    syncStatusSpan.textContent = `✓ ${msg}`;
    setTimeout(() => { if(syncStatusSpan.textContent.includes(msg)) syncStatusSpan.textContent = '✓ live sync'; }, 1500);
}

function exportCodeFile() {
    const code = codeEditor.value;
    let filename = `button_component.`;
    if (currentPlatform === 'web') filename += 'html';
    else if (currentPlatform === 'react') filename += 'tsx';
    else if (currentPlatform === 'android') filename += 'xml';
    else filename += 'py';
    const blob = new Blob([code], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    updateSyncStatus('code exported!');
}

btnBgColor.addEventListener('input', applyDesign);
btnTextColor.addEventListener('input', applyDesign);
btnLabel.addEventListener('input', applyDesign);
borderRadius.addEventListener('change', applyDesign);
fontSize.addEventListener('change', applyDesign);
hoverEffect.addEventListener('change', applyDesign);
liveButton.addEventListener('click', () => alert('✨ Glitch Button | Export for Web, React, Android, Tkinter'));
syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
copyFinalCodeBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(codeEditor.value);
    const orig = copyFinalCodeBtn.innerText;
    copyFinalCodeBtn.innerText = '✓ Copied!';
    setTimeout(() => copyFinalCodeBtn.innerText = orig, 1500);
});
exportCodeBtn.addEventListener('click', exportCodeFile);

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