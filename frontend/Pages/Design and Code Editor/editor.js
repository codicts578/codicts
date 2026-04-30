
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
    const exportImageBtn = document.getElementById('exportImageBtn');
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
        switch(hover) {
            case 'lift': return 'transform: translateY(-3px); filter: brightness(1.05);';
            case 'scale': return 'transform: scale(1.05);';
            case 'darken': return 'filter: brightness(0.9);';
            case 'glow': return `box-shadow: 0 0 15px ${bgColor}; filter: brightness(1.1);`;
            default: return '';
        }
    }
    
    // ========== WEB GENERATOR ==========
    function generateWebCode() {
        const d = getDesign();
        const hoverCss = getHoverCSS(d.hover, d.bgColor);
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
    
    // ========== REACT (TSX) GENERATOR ==========
    function generateReactCode() {
        const d = getDesign();
        const hoverCss = getHoverCSS(d.hover, d.bgColor);
        const styleObj = {
            background: d.bgColor,
            color: d.textColor,
            borderRadius: d.radius,
            padding: `${d.padY} ${d.padX}`,
            fontSize: d.fontSize,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: 'none',
            fontFamily: "system-ui, 'Segoe UI', sans-serif"
        };
        const hoverStyleRaw = hoverCss;
        return `// React + TypeScript Button Component
// File: CustomButton.tsx

import React from 'react';
import './CustomButton.css'; // or use inline styles with hover

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

/* Add hover effect in CSS file (CustomButton.css): */
/*
.custom-button-react:hover {
${hoverCssRaw}
}
*/

// Usage example:
// import CustomButton from './CustomButton';
// <CustomButton onClick={() => console.log('clicked')} />`;
    }
    
    // ========== ANDROID XML ==========
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
    
    // ========== TKINTER ==========
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
        liveButton.innerText = d.label;
        const hoverCss = getHoverCSS(d.hover, d.bgColor);
        let styleEl = document.getElementById('dynamic-hover-style');
        if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'dynamic-hover-style'; document.head.appendChild(styleEl); }
        styleEl.textContent = `.live-button:hover { ${hoverCss} transition: all 0.2s ease; }`;
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
        if (txt.includes('translateY')) hoverEffect.value='lift';
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
    
    // EXPORT CODE AS FILE
    function exportCodeFile() {
        const code = codeEditor.value;
        let filename = `button_component.`;
        let mime = 'text/plain';
        if (currentPlatform === 'web') filename += 'html';
        else if (currentPlatform === 'react') filename += 'tsx';
        else if (currentPlatform === 'android') filename += 'xml';
        else filename += 'py';
        const blob = new Blob([code], {type: mime});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        updateSyncStatus('code exported!');
    }
    
    // EXPORT PNG OF BUTTON DESIGN
    async function exportDesignAsImage() {
        const buttonElement = liveButton;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const rect = buttonElement.getBoundingClientRect();
        const computedStyle = getComputedStyle(buttonElement);
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.fillStyle = computedStyle.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // draw border-radius clip
        ctx.globalCompositeOperation = 'destination-in';
        const radiusPx = parseFloat(computedStyle.borderRadius);
        ctx.beginPath();
        ctx.roundRect(0, 0, canvas.width, canvas.height, radiusPx);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        // draw text
        ctx.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily.split(',')[0]}`;
        ctx.fillStyle = computedStyle.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(buttonElement.innerText, canvas.width/2, canvas.height/2);
        
        // fallback for roundRect
        if (!ctx.roundRect) {
            ctx.roundRect = function(x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                this.moveTo(x+r, y);
                this.lineTo(x+w-r, y);
                this.quadraticCurveTo(x+w, y, x+w, y+r);
                this.lineTo(x+w, y+h-r);
                this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
                this.lineTo(x+r, y+h);
                this.quadraticCurveTo(x, y+h, x, y+h-r);
                this.lineTo(x, y+r);
                this.quadraticCurveTo(x, y, x+r, y);
                return this;
            };
        }
        
        // alternative: use html2canvas but to avoid external lib, we use simpler screenshot with canvas drawing + shadow/hover? use direct draw
        // For higher fidelity, capture using html2canvas? But we'll implement a clean approach: draw the button appearance
        // Actually re-draw style exactly
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = computedStyle.backgroundColor;
        ctx.beginPath();
        ctx.roundRect(0, 0, canvas.width, canvas.height, radiusPx);
        ctx.fill();
        ctx.fillStyle = computedStyle.color;
        ctx.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily.split(',')[0]}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(buttonElement.innerText, canvas.width/2, canvas.height/2);
        
        canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `button_design_${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(link.href);
            updateSyncStatus('PNG exported');
        }, 'image/png');
    }
    
    // add roundRect
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.moveTo(x+r, y);
            this.lineTo(x+w-r, y);
            this.quadraticCurveTo(x+w, y, x+w, y+r);
            this.lineTo(x+w, y+h-r);
            this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
            this.lineTo(x+r, y+h);
            this.quadraticCurveTo(x, y+h, x, y+h-r);
            this.lineTo(x, y+r);
            this.quadraticCurveTo(x, y, x+r, y);
            return this;
        };
    }
    
    // Event listeners
    btnBgColor.addEventListener('input', applyDesign);
    btnTextColor.addEventListener('input', applyDesign);
    btnLabel.addEventListener('input', applyDesign);
    borderRadius.addEventListener('change', applyDesign);
    fontSize.addEventListener('change', applyDesign);
    hoverEffect.addEventListener('change', applyDesign);
    liveButton.addEventListener('click', () => alert('✨ Interactive preview | Export for Web, React, Android, Tkinter'));
    syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
    copyFinalCodeBtn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(codeEditor.value);
        const orig = copyFinalCodeBtn.innerText;
        copyFinalCodeBtn.innerText = '✅ Copied!';
        setTimeout(() => copyFinalCodeBtn.innerText = orig, 1500);
    });
    exportCodeBtn.addEventListener('click', exportCodeFile);
    exportImageBtn.addEventListener('click', exportDesignAsImage);
    
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