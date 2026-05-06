(function() {
    // DOM Elements
    const cardBgColor = document.getElementById('cardBgColor');
    const borderColor = document.getElementById('borderColor');
    const pixelColorPicker = document.getElementById('pixelColor');
    const gridSizeSelect = document.getElementById('gridSize');
    const animSpeedRange = document.getElementById('animSpeed');
    const defaultTitleInput = document.getElementById('defaultTitle');
    const activeTitleInput = document.getElementById('activeTitle');
    
    const card = document.getElementById('card');
    const pixelGrid = card.querySelector('.pixelated-image-card__pixels');
    const activeEl = card.querySelector('.pixelated-image-card__active');
    const defaultEl = card.querySelector('.pixelated-image-card__default');
    const defaultTitle = defaultEl.querySelector('h2');
    const defaultDesc = defaultEl.querySelector('p');
    const activeTitle = activeEl.querySelector('h2');
    const activeDesc = activeEl.querySelector('p');
    
    const codeEditor = document.getElementById('codeEditor');
    const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    let isAnimating = false;
    let currentGridSize = 7;
    let currentAnimSpeed = 0.3;
    
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
    
    function createPixels(gridSize, pixelColor) {
        pixelGrid.innerHTML = "";
        const size = 100 / gridSize;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const pixel = document.createElement("div");
                pixel.classList.add("pixelated-image-card__pixel");
                pixel.style.backgroundColor = pixelColor;
                pixel.style.width = size + "%";
                pixel.style.height = size + "%";
                pixel.style.left = (col * size) + "%";
                pixel.style.top = (row * size) + "%";
                pixel.style.opacity = "0";
                pixel.style.display = "block";
                pixelGrid.appendChild(pixel);
            }
        }
    }
    
    function animatePixels(activate) {
        if (isAnimating) return;
        isAnimating = true;
        
        const pixels = pixelGrid.querySelectorAll(".pixelated-image-card__pixel");
        const totalPixels = pixels.length;
        const staggerDelay = (currentAnimSpeed * 1000) / totalPixels;
        
        pixels.forEach(pixel => pixel.style.opacity = "0");
        
        const shuffled = Array.from(pixels);
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        shuffled.forEach((pixel, index) => {
            setTimeout(() => { pixel.style.opacity = "1"; }, index * staggerDelay);
        });
        
        setTimeout(() => {
            if (activate) {
                activeEl.style.display = "flex";
                defaultEl.style.display = "none";
            } else {
                activeEl.style.display = "none";
                defaultEl.style.display = "block";
            }
        }, currentAnimSpeed * 1000);
        
        setTimeout(() => {
            shuffled.forEach((pixel, index) => {
                setTimeout(() => { pixel.style.opacity = "0"; }, index * staggerDelay);
            });
        }, currentAnimSpeed * 1000 + 100);
        
        setTimeout(() => { isAnimating = false; }, (currentAnimSpeed * 2000) + 200);
    }
    
    function applyCardDesign() {
        card.style.backgroundColor = cardBgColor.value;
        card.style.borderColor = borderColor.value;
        
        defaultTitle.textContent = defaultTitleInput.value;
        activeTitle.textContent = activeTitleInput.value;
        
        const newGridSize = parseInt(gridSizeSelect.value);
        if (newGridSize !== currentGridSize) {
            currentGridSize = newGridSize;
            createPixels(currentGridSize, pixelColorPicker.value);
        } else {
            const pixels = pixelGrid.querySelectorAll(".pixelated-image-card__pixel");
            pixels.forEach(pixel => {
                pixel.style.backgroundColor = pixelColorPicker.value;
            });
        }
        
        currentAnimSpeed = parseFloat(animSpeedRange.value);
        updateCodeForPlatform();
        syncStatusSpan.textContent = '✓ design updated';
        setTimeout(() => { if(syncStatusSpan.textContent.includes('updated')) syncStatusSpan.textContent = '✓ live sync'; }, 1500);
    }
    
    card.addEventListener("mouseenter", () => {
        if (!isAnimating && activeEl.style.display !== "flex") animatePixels(true);
    });
    
    card.addEventListener("mouseleave", () => {
        if (!isAnimating && activeEl.style.display === "flex") animatePixels(false);
    });
    
    card.addEventListener("click", () => {
        if (!isAnimating) animatePixels(activeEl.style.display !== "flex");
    });
    
    function escapeHtml(str) { return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }
    function escapeXml(str) { return str.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[m]); }
    
    // Web Code Generator
    function generateWebCode() {
        return `<!-- Pixelated Card - Web Component -->
<style>
.pixelated-card {
background-color: ${cardBgColor.value};
border: 2px solid ${borderColor.value};
border-radius: 15px;
width: 100%;
max-width: 380px;
position: relative;
overflow: hidden;
cursor: pointer;
font-family: 'Inter', sans-serif;
}
.pixelated-card__default, .pixelated-card__active, .pixel-grid {
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
display: flex;
justify-content: center;
align-items: center;
}
.pixelated-card__default { z-index: 1; position: relative; }
.pixelated-card__active { z-index: 2; display: none; position: absolute; }
.pixel-grid { pointer-events: none; z-index: 3; position: absolute; }
.pixel { position: absolute; transition: opacity 0.05s ease; }
.content-area { padding: 60px 30px; text-align: center; }
.content-area h2 { font-size: 1.8rem; margin-bottom: 10px; color: white; }
</style>

<div class="pixelated-card" id="pixelCard">
<div style="padding-top: 100%"></div>
<div class="pixelated-card__default">
<div class="content-area"><h2>${escapeHtml(defaultTitleInput.value)}</h2><p>✨ Hover for pixel animation ✨</p></div>
</div>
<div class="pixelated-card__active">
<div class="content-area"><h2>${escapeHtml(activeTitleInput.value)}</h2><p>🎉 Pixel effect complete! 🎉</p></div>
</div>
<div class="pixel-grid" id="pixelGrid"></div>
</div>

<script>
const gridSize = ${currentGridSize};
const pixelColor = "${pixelColorPicker.value}";
const animSpeed = ${currentAnimSpeed};
let isAnimating = false;
const card = document.getElementById('pixelCard');
const pixelGridDiv = document.getElementById('pixelGrid');
const activeDiv = card.querySelector('.pixelated-card__active');
const defaultDiv = card.querySelector('.pixelated-card__default');

function createPixels() {
pixelGridDiv.innerHTML = "";
const size = 100 / gridSize;
for (let row = 0; row < gridSize; row++) {
for (let col = 0; col < gridSize; col++) {
    const pixel = document.createElement("div");
    pixel.className = "pixel";
    pixel.style.backgroundColor = pixelColor;
    pixel.style.width = size + "%";
    pixel.style.height = size + "%";
    pixel.style.left = (col * size) + "%";
    pixel.style.top = (row * size) + "%";
    pixel.style.opacity = "0";
    pixelGridDiv.appendChild(pixel);
}
}
}

function animatePixels(activate) {
if (isAnimating) return;
isAnimating = true;
const pixels = document.querySelectorAll('.pixel');
const total = pixels.length;
const stagger = (animSpeed * 1000) / total;
pixels.forEach(p => p.style.opacity = "0");
const shuffled = Array.from(pixels);
for (let i = shuffled.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}
shuffled.forEach((p, idx) => setTimeout(() => p.style.opacity = "1", idx * stagger));
setTimeout(() => {
if (activate) { activeDiv.style.display = "flex"; defaultDiv.style.display = "none"; }
else { activeDiv.style.display = "none"; defaultDiv.style.display = "block"; }
}, animSpeed * 1000);
setTimeout(() => shuffled.forEach((p, idx) => setTimeout(() => p.style.opacity = "0", idx * stagger)), animSpeed * 1000 + 100);
setTimeout(() => isAnimating = false, (animSpeed * 2000) + 200);
}

createPixels();
card.addEventListener("mouseenter", () => { if (!isAnimating && activeDiv.style.display !== "flex") animatePixels(true); });
card.addEventListener("mouseleave", () => { if (!isAnimating && activeDiv.style.display === "flex") animatePixels(false); });
card.addEventListener("click", () => { if (!isAnimating) animatePixels(activeDiv.style.display !== "flex"); });
<\/script>`;
    }
    
    function generateReactCode() {
        return `// PixelatedCard.tsx - React Component
import React, { useState, useRef, useEffect } from 'react';
import './PixelatedCard.css';

interface PixelatedCardProps {
defaultTitle?: string;
activeTitle?: string;
cardBg?: string;
borderColor?: string;
pixelColor?: string;
gridSize?: number;
animationSpeed?: number;
}

const PixelatedCard: React.FC<PixelatedCardProps> = ({
defaultTitle = "${escapeHtml(defaultTitleInput.value)}",
activeTitle = "${escapeHtml(activeTitleInput.value)}",
cardBg = "${cardBgColor.value}",
borderColor = "${borderColor.value}",
pixelColor = "${pixelColorPicker.value}",
gridSize = ${currentGridSize},
animationSpeed = ${currentAnimSpeed},
}) => {
const [isActive, setIsActive] = useState(false);
const [isAnimating, setIsAnimating] = useState(false);
const pixelGridRef = useRef<HTMLDivElement>(null);

const createPixels = () => {
if (!pixelGridRef.current) return;
pixelGridRef.current.innerHTML = "";
const size = 100 / gridSize;
for (let row = 0; row < gridSize; row++) {
for (let col = 0; col < gridSize; col++) {
const pixel = document.createElement("div");
pixel.className = "pixel";
pixel.style.backgroundColor = pixelColor;
pixel.style.width = size + "%";
pixel.style.height = size + "%";
pixel.style.left = (col * size) + "%";
pixel.style.top = (row * size) + "%";
pixel.style.opacity = "0";
pixelGridRef.current.appendChild(pixel);
}
}
};

useEffect(() => { createPixels(); }, [gridSize, pixelColor]);

const animatePixels = (activate: boolean) => {
if (isAnimating) return;
setIsAnimating(true);
const pixels = pixelGridRef.current?.children || [];
const total = pixels.length;
const stagger = (animationSpeed * 1000) / total;
Array.from(pixels).forEach(p => (p as HTMLElement).style.opacity = "0");
const shuffled = Array.from(pixels);
for (let i = shuffled.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}
shuffled.forEach((p, idx) => setTimeout(() => (p as HTMLElement).style.opacity = "1", idx * stagger));
setTimeout(() => setIsActive(activate), animationSpeed * 1000);
setTimeout(() => shuffled.forEach((p, idx) => setTimeout(() => (p as HTMLElement).style.opacity = "0", idx * stagger)), animationSpeed * 1000 + 100);
setTimeout(() => setIsAnimating(false), (animationSpeed * 2000) + 200);
};

return (
<div className="pixelated-card" style={{ backgroundColor: cardBg, borderColor: borderColor }}
    onMouseEnter={() => !isActive && !isAnimating && animatePixels(true)}
    onMouseLeave={() => isActive && !isAnimating && animatePixels(false)}
    onClick={() => !isAnimating && animatePixels(!isActive)}>
<div style={{ paddingTop: '100%' }}></div>
<div className="default-content" style={{ display: isActive ? 'none' : 'block' }}>
<div className="content-area"><h2>{defaultTitle}</h2><p>✨ Hover for pixels ✨</p></div>
</div>
<div className="active-content" style={{ display: isActive ? 'flex' : 'none' }}>
<div className="content-area"><h2>{activeTitle}</h2><p>🎉 Pixel effect complete! 🎉</p></div>
</div>
<div className="pixel-grid" ref={pixelGridRef}></div>
</div>
);
};
export default PixelatedCard;`;
    }
    
    function generateAndroidCode() {
        return `<!-- Android XML Layout - Pixel Card Style -->
<!-- res/drawable/pixel_card_bg.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
<solid android:color="${cardBgColor.value}"/>
<stroke android:width="2dp" android:color="${borderColor.value}"/>
<corners android:radius="15dp"/>
</shape>

<!-- res/layout/activity_main.xml -->
<FrameLayout
android:layout_width="wrap_content"
android:layout_height="wrap_content"
android:background="@drawable/pixel_card_bg"
android:padding="16dp"
android:clickable="true">

<TextView
android:id="@+id/defaultTitle"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:text="${escapeXml(defaultTitleInput.value)}"
android:textColor="#FFFFFF"
android:textSize="24sp"
android:textStyle="bold"
android:gravity="center"
android:padding="60dp 30dp" />

<TextView
android:id="@+id/activeTitle"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:text="${escapeXml(activeTitleInput.value)}"
android:textColor="#FFFFFF"
android:textSize="24sp"
android:textStyle="bold"
android:gravity="center"
android:padding="60dp 30dp"
android:visibility="gone" />
</FrameLayout>

<!-- For pixel animation effect in Android, use ObjectAnimator with GridLayout -->`;
    }
    
    function generateTkinterCode() {
        return `# Python Tkinter - Pixel Card Style
import tkinter as tk

root = tk.Tk()
root.title("Pixel Card")
root.configure(bg='#0b1120')

card_frame = tk.Frame(
root, bg="${cardBgColor.value}", 
highlightbackground="${borderColor.value}", 
highlightcolor="${borderColor.value}",
highlightthickness=2, 
bd=0, 
relief="solid"
)
card_frame.pack(pady=50, padx=50)

default_label = tk.Label(
card_frame, 
text="${escapeXml(defaultTitleInput.value)}", 
fg="white", 
bg="${cardBgColor.value}", 
font=("Inter", 24, "bold"),
wraplength=300
)
default_label.pack(padx=60, pady=60)

def on_enter(e):
default_label.config(text="${escapeXml(activeTitleInput.value)}")
def on_leave(e):
default_label.config(text="${escapeXml(defaultTitleInput.value)}")

card_frame.bind("<Enter>", on_enter)
card_frame.bind("<Leave>", on_leave)
default_label.bind("<Enter>", on_enter)
default_label.bind("<Leave>", on_leave)

root.geometry("500x500")
root.mainloop()`;
    }
    
    function updateCodeForPlatform() {
        let code = '';
        if(currentPlatform === 'web') code = generateWebCode();
        else if(currentPlatform === 'react') code = generateReactCode();
        else if(currentPlatform === 'android') code = generateAndroidCode();
        else if(currentPlatform === 'tkinter') code = generateTkinterCode();
        codeEditor.value = code;
    }
    
    async function copyCode() {
        await navigator.clipboard.writeText(codeEditor.value);
        copyFinalCodeBtn.innerText = '✓ Copied!';
        setTimeout(() => copyFinalCodeBtn.innerText = 'Copy Code', 1500);
        showToastMessage('Code copied to clipboard');
    }
    
    function exportCodeFile() {
        const code = codeEditor.value;
        let ext = 'txt';
        if(currentPlatform === 'web') ext = 'html';
        else if(currentPlatform === 'react') ext = 'tsx';
        else if(currentPlatform === 'android') ext = 'xml';
        else if(currentPlatform === 'tkinter') ext = 'py';
        const blob = new Blob([code], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `pixel_card.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        showToastMessage(`📁 ${ext.toUpperCase()} file exported`);
    }
    
    cardBgColor.addEventListener('input', applyCardDesign);
    borderColor.addEventListener('input', applyCardDesign);
    pixelColorPicker.addEventListener('input', applyCardDesign);
    gridSizeSelect.addEventListener('change', applyCardDesign);
    animSpeedRange.addEventListener('input', applyCardDesign);
    defaultTitleInput.addEventListener('input', applyCardDesign);
    activeTitleInput.addEventListener('input', applyCardDesign);
    
    copyFinalCodeBtn.addEventListener('click', copyCode);
    exportCodeBtn.addEventListener('click', exportCodeFile);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.getAttribute('data-platform');
            updateCodeForPlatform();
        });
    });
    
    createPixels(currentGridSize, pixelColorPicker.value);
    applyCardDesign();
})();