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
    const exportImageBtn = document.getElementById('exportImageBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    let isAnimating = false;
    let currentGridSize = 7;
    let currentAnimSpeed = 0.3;
    
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
        
        // Hide all pixels initially
        pixels.forEach(pixel => {
            pixel.style.opacity = "0";
            pixel.style.transition = "opacity 0.05s ease";
        });
        
        // Show pixels randomly
        const shuffled = Array.from(pixels);
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        shuffled.forEach((pixel, index) => {
            setTimeout(() => {
                pixel.style.opacity = "1";
            }, index * staggerDelay);
        });
        
        // Switch content after animation
        setTimeout(() => {
            if (activate) {
                activeEl.style.display = "flex";
                defaultEl.style.display = "none";
            } else {
                activeEl.style.display = "none";
                defaultEl.style.display = "block";
            }
        }, currentAnimSpeed * 1000);
        
        // Hide pixels
        setTimeout(() => {
            shuffled.forEach((pixel, index) => {
                setTimeout(() => {
                    pixel.style.opacity = "0";
                }, index * staggerDelay);
            });
        }, currentAnimSpeed * 1000 + 100);
        
        setTimeout(() => {
            isAnimating = false;
        }, (currentAnimSpeed * 2000) + 200);
    }
    
    function applyCardDesign() {
        // Update card styling
        card.style.backgroundColor = cardBgColor.value;
        card.style.borderColor = borderColor.value;
        
        // Update text content
        defaultTitle.textContent = defaultTitleInput.value;
        activeTitle.textContent = activeTitleInput.value;
        
        // Update grid if changed
        const newGridSize = parseInt(gridSizeSelect.value);
        if (newGridSize !== currentGridSize) {
            currentGridSize = newGridSize;
            createPixels(currentGridSize, pixelColorPicker.value);
        } else {
            // Update pixel colors
            const pixels = pixelGrid.querySelectorAll(".pixelated-image-card__pixel");
            pixels.forEach(pixel => {
                pixel.style.backgroundColor = pixelColorPicker.value;
            });
        }
        
        currentAnimSpeed = parseFloat(animSpeedRange.value);
        updateCodeForPlatform();
    }
    
    // Hover events (No GSAP - pure JS/CSS)
    let hoverTimeout;
    card.addEventListener("mouseenter", () => {
        if (!isAnimating && activeEl.style.display !== "flex") {
            animatePixels(true);
        }
    });
    
    card.addEventListener("mouseleave", () => {
        if (!isAnimating && activeEl.style.display === "flex") {
            animatePixels(false);
        }
    });
    
    // Click support for mobile
    card.addEventListener("click", () => {
        if (!isAnimating) {
            const isActive = activeEl.style.display === "flex";
            animatePixels(!isActive);
        }
    });
    
    // Code Generators
    function generateWebCode() {
        return `<!-- Pixelated Image Card - No GSAP Required -->
<style>
.pixelated-image-card {
background-color: ${cardBgColor.value};
color: #fff;
border-radius: 15px;
border: 2px solid ${borderColor.value};
width: 100%;
max-width: 380px;
position: relative;
overflow: hidden;
cursor: pointer;
font-family: Arial, sans-serif;
}

.pixelated-image-card__default,
.pixelated-image-card__active,
.pixelated-image-card__pixels {
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
display: flex;
justify-content: center;
align-items: center;
}

.pixelated-image-card__default {
z-index: 1;
position: relative;
}

.pixelated-image-card__active {
z-index: 2;
display: none;
position: absolute;
}

.pixelated-image-card__pixels {
pointer-events: none;
z-index: 3;
position: absolute;
}

.pixelated-image-card__pixel {
position: absolute;
transition: opacity 0.05s ease;
}

.content-area {
padding: 60px 30px;
text-align: center;
}

.content-area h2 {
font-size: 1.8rem;
margin-bottom: 10px;
}
</style>

<div class="pixelated-image-card" id="pixelCard">
<div style="padding-top: 100%"></div>
<div class="pixelated-image-card__default">
<div class="content-area">
    <h2>${defaultTitleInput.value}</h2>
    <p>✨ Hover to see pixel animation ✨</p>
</div>
</div>
<div class="pixelated-image-card__active">
<div class="content-area">
    <h2>${activeTitleInput.value}</h2>
    <p>🎉 Pixel effect complete! 🎉</p>
</div>
</div>
<div class="pixelated-image-card__pixels"></div>
</div>

<script>
const gridSize = ${currentGridSize};
const pixelColor = "${pixelColorPicker.value}";
const animationDuration = ${currentAnimSpeed};
let isAnimating = false;

const card = document.getElementById('pixelCard');
const pixelGrid = card.querySelector('.pixelated-image-card__pixels');
const activeEl = card.querySelector('.pixelated-image-card__active');
const defaultEl = card.querySelector('.pixelated-image-card__default');

// Create pixels
function createPixels() {
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
const staggerDelay = (animationDuration * 1000) / totalPixels;

pixels.forEach(pixel => pixel.style.opacity = "0");

const shuffled = Array.from(pixels);
for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}

shuffled.forEach((pixel, index) => {
    setTimeout(() => pixel.style.opacity = "1", index * staggerDelay);
});

setTimeout(() => {
    if (activate) {
        activeEl.style.display = "flex";
        defaultEl.style.display = "none";
    } else {
        activeEl.style.display = "none";
        defaultEl.style.display = "block";
    }
}, animationDuration * 1000);

setTimeout(() => {
    shuffled.forEach((pixel, index) => {
        setTimeout(() => pixel.style.opacity = "0", index * staggerDelay);
    });
}, animationDuration * 1000 + 100);

setTimeout(() => isAnimating = false, (animationDuration * 2000) + 200);
}

createPixels();

card.addEventListener("mouseenter", () => {
if (!isAnimating && activeEl.style.display !== "flex") animatePixels(true);
});

card.addEventListener("mouseleave", () => {
if (!isAnimating && activeEl.style.display === "flex") animatePixels(false);
});

card.addEventListener("click", () => {
if (!isAnimating) animatePixels(activeEl.style.display !== "flex");
});
<\/script>`;
    }
    
    function generateReactCode() {
        return `// PixelatedCard.jsx - React Component (No GSAP)
import React, { useState, useRef, useEffect } from 'react';
import './PixelatedCard.css';

const PixelatedCard = ({ 
defaultTitle = "${defaultTitleInput.value}",
activeTitle = "${activeTitleInput.value}",
cardBg = "${cardBgColor.value}",
borderColorVal = "${borderColor.value}",
pixelColor = "${pixelColorPicker.value}",
gridSize = ${currentGridSize},
animationSpeed = ${currentAnimSpeed}
}) => {
const [isActive, setIsActive] = useState(false);
const [isAnimating, setIsAnimating] = useState(false);
const pixelGridRef = useRef(null);

useEffect(() => {
createPixels();
}, [gridSize, pixelColor]);

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

const animatePixels = (activate) => {
if (isAnimating) return;
setIsAnimating(true);

const pixels = pixelGridRef.current.children;
const totalPixels = pixels.length;
const staggerDelay = (animationSpeed * 1000) / totalPixels;

Array.from(pixels).forEach(p => p.style.opacity = "0");

const shuffled = Array.from(pixels);
for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}

shuffled.forEach((pixel, index) => {
    setTimeout(() => pixel.style.opacity = "1", index * staggerDelay);
});

setTimeout(() => setIsActive(activate), animationSpeed * 1000);

setTimeout(() => {
    shuffled.forEach((pixel, index) => {
        setTimeout(() => pixel.style.opacity = "0", index * staggerDelay);
    });
}, animationSpeed * 1000 + 100);

setTimeout(() => setIsAnimating(false), (animationSpeed * 2000) + 200);
};

return (
<div 
    className="pixelated-card"
    style={{ backgroundColor: cardBg, borderColor: borderColorVal }}
    onMouseEnter={() => !isActive && !isAnimating && animatePixels(true)}
    onMouseLeave={() => isActive && !isAnimating && animatePixels(false)}
    onClick={() => !isAnimating && animatePixels(!isActive)}
>
    <div style={{ paddingTop: '100%' }}></div>
    <div className="default-content" style={{ display: isActive ? 'none' : 'block' }}>
        <div className="content-area">
            <h2>{defaultTitle}</h2>
            <p>✨ Hover to see pixel animation ✨</p>
        </div>
    </div>
    <div className="active-content" style={{ display: isActive ? 'flex' : 'none' }}>
        <div className="content-area">
            <h2>{activeTitle}</h2>
            <p>🎉 Pixel effect complete! 🎉</p>
        </div>
    </div>
    <div className="pixel-grid" ref={pixelGridRef}></div>
</div>
);
};

export default PixelatedCard;`;
    }
    
    function generateVueCode() {
        return `<!-- PixelatedCard.vue - Vue Component (No GSAP) -->
<template>
<div 
class="pixelated-card"
:style="{ backgroundColor: cardBg, borderColor: borderColorVal }"
@mouseenter="handleHover(true)"
@mouseleave="handleHover(false)"
@click="handleClick"
>
<div style="padding-top: 100%"></div>
<div class="default-content" v-show="!isActive">
    <div class="content-area">
        <h2>{{ defaultTitle }}</h2>
        <p>✨ Hover to see pixel animation ✨</p>
    </div>
</div>
<div class="active-content" v-show="isActive">
    <div class="content-area">
        <h2>{{ activeTitle }}</h2>
        <p>🎉 Pixel effect complete! 🎉</p>
    </div>
</div>
<div class="pixel-grid" ref="pixelGrid"></div>
</div>
</template>

<script>
export default {
props: {
defaultTitle: { type: String, default: "${defaultTitleInput.value}" },
activeTitle: { type: String, default: "${activeTitleInput.value}" },
cardBg: { type: String, default: "${cardBgColor.value}" },
borderColorVal: { type: String, default: "${borderColor.value}" },
pixelColor: { type: String, default: "${pixelColorPicker.value}" },
gridSize: { type: Number, default: ${currentGridSize} },
animationSpeed: { type: Number, default: ${currentAnimSpeed} }
},
data() {
return {
    isActive: false,
    isAnimating: false
};
},
mounted() {
this.createPixels();
},
watch: {
gridSize() { this.createPixels(); },
pixelColor() { this.createPixels(); }
},
methods: {
createPixels() {
    if (!this.$refs.pixelGrid) return;
    this.$refs.pixelGrid.innerHTML = "";
    const size = 100 / this.gridSize;
    
    for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
            const pixel = document.createElement("div");
            pixel.className = "pixel";
            pixel.style.backgroundColor = this.pixelColor;
            pixel.style.width = size + "%";
            pixel.style.height = size + "%";
            pixel.style.left = (col * size) + "%";
            pixel.style.top = (row * size) + "%";
            pixel.style.opacity = "0";
            this.$refs.pixelGrid.appendChild(pixel);
        }
    }
},
animatePixels(activate) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    const pixels = this.$refs.pixelGrid.children;
    const totalPixels = pixels.length;
    const staggerDelay = (this.animationSpeed * 1000) / totalPixels;
    
    Array.from(pixels).forEach(p => p.style.opacity = "0");
    
    const shuffled = Array.from(pixels);
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    shuffled.forEach((pixel, index) => {
        setTimeout(() => pixel.style.opacity = "1", index * staggerDelay);
    });
    
    setTimeout(() => this.isActive = activate, this.animationSpeed * 1000);
    
    setTimeout(() => {
        shuffled.forEach((pixel, index) => {
            setTimeout(() => pixel.style.opacity = "0", index * staggerDelay);
        });
    }, this.animationSpeed * 1000 + 100);
    
    setTimeout(() => this.isAnimating = false, (this.animationSpeed * 2000) + 200);
},
handleHover(enter) {
    if (!this.isAnimating && enter !== this.isActive) {
        this.animatePixels(enter);
    }
},
handleClick() {
    if (!this.isAnimating) this.animatePixels(!this.isActive);
}
}
};
<\/script>

<style scoped>
.pixelated-card {
background-color: #222;
color: #fff;
border-radius: 15px;
border: 2px solid #fff;
width: 100%;
max-width: 380px;
position: relative;
overflow: hidden;
cursor: pointer;
}
.default-content, .active-content, .pixel-grid {
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
display: flex;
justify-content: center;
align-items: center;
}
.default-content { z-index: 1; position: relative; }
.active-content { z-index: 2; position: absolute; }
.pixel-grid { pointer-events: none; z-index: 3; position: absolute; }
.pixel-grid .pixel { position: absolute; transition: opacity 0.05s ease; }
.content-area { padding: 60px 30px; text-align: center; }
.content-area h2 { font-size: 1.8rem; margin-bottom: 10px; }
</style>`;
    }
    
    function updateCodeForPlatform() {
        let code = '';
        if(currentPlatform === 'web') code = generateWebCode();
        else if(currentPlatform === 'react') code = generateReactCode();
        else if(currentPlatform === 'vue') code = generateVueCode();
        codeEditor.value = code;
    }
    
    async function copyCode() {
        await navigator.clipboard.writeText(codeEditor.value);
        copyFinalCodeBtn.innerText = '✅ Copied!';
        setTimeout(() => copyFinalCodeBtn.innerText = '📋 Copy Code', 1500);
        syncStatusSpan.textContent = '✓ copied to clipboard';
        setTimeout(() => syncStatusSpan.textContent = '✓ ready to copy', 1500);
    }
    
    function exportCodeFile() {
        const code = codeEditor.value;
        let ext = currentPlatform === 'web' ? 'html' : (currentPlatform === 'react' ? 'jsx' : 'vue');
        const blob = new Blob([code], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `pixel_card.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        syncStatusSpan.textContent = '✓ exported';
        setTimeout(() => syncStatusSpan.textContent = '✓ ready to copy', 1500);
    }
    
    async function exportCardAsPNG() {
        const node = document.querySelector('.pixelated-image-card');
        if(!node) return;
        try {
            const html2canvas = await import('https://cdn.skypack.dev/html2canvas@1.4.1');
            const canvas = await html2canvas.default(node, { scale: 2, backgroundColor: '#f1f5f9' });
            const link = document.createElement('a');
            link.download = `pixel_card_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            syncStatusSpan.textContent = '✓ PNG saved';
            setTimeout(() => syncStatusSpan.textContent = '✓ ready to copy', 1500);
        } catch(e) {
            alert('Please allow a moment for html2canvas to load');
        }
    }
    
    // Event listeners
    cardBgColor.addEventListener('input', applyCardDesign);
    borderColor.addEventListener('input', applyCardDesign);
    pixelColorPicker.addEventListener('input', applyCardDesign);
    gridSizeSelect.addEventListener('change', applyCardDesign);
    animSpeedRange.addEventListener('input', applyCardDesign);
    defaultTitleInput.addEventListener('input', applyCardDesign);
    activeTitleInput.addEventListener('input', applyCardDesign);
    
    copyFinalCodeBtn.addEventListener('click', copyCode);
    exportCodeBtn.addEventListener('click', exportCodeFile);
    exportImageBtn.addEventListener('click', exportCardAsPNG);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.getAttribute('data-platform');
            updateCodeForPlatform();
        });
    });
    
    // Initialize
    createPixels(currentGridSize, pixelColorPicker.value);
    applyCardDesign();
})();