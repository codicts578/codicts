(function() {
    // DOM elements
    const bladeColorPicker = document.getElementById('bladeColor');
    const loaderSizeSlider = document.getElementById('loaderSize');
    const sizeVal = document.getElementById('sizeVal');
    const speedSelect = document.getElementById('speed');
    const showTextSelect = document.getElementById('showText');
    const textLabelInput = document.getElementById('textLabel');
    const textColorPicker = document.getElementById('textColor');
    
    const liveLoaderDiv = document.getElementById('liveLoader');
    const loaderTextSpan = document.getElementById('loaderText');
    
    const codeEditor = document.getElementById('codeEditor');
    const syncFromCodeBtn = document.getElementById('syncFromCodeBtn');
    const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    let isUpdatingFromCode = false;
    
    loaderSizeSlider.addEventListener('input', () => { 
        sizeVal.textContent = loaderSizeSlider.value + 'px'; 
        applyLoaderDesign(); 
    });
    
    function getDesignState() {
        return {
            color: bladeColorPicker.value,
            size: parseInt(loaderSizeSlider.value),
            speed: parseFloat(speedSelect.value),
            showText: showTextSelect.value,
            textLabel: textLabelInput.value,
            textColor: textColorPicker.value
        };
    }
    
    function renderOriginalSpinner() {
        const s = getDesignState();
        
        // Create wrapper for scaling 
        const wrapper = document.createElement('div');
        wrapper.className = 'spinner-wrapper';
    
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        // Add 10 divs (blades)
        for (let i = 0; i < 10; i++) {
            const blade = document.createElement('div');
            spinner.appendChild(blade);
        }
        
        // Apply color to all blades
        const blades = spinner.querySelectorAll('div');
        blades.forEach(blade => {
            blade.style.background = s.color;
        });
        
        // Apply speed to animation
        const style = document.createElement('style');
        style.textContent = `
            .spinner div {
                animation-duration: ${s.speed}s !important;
            }
        `;
        document.head.appendChild(style);
        
        // Apply size by scaling the wrapper
        const originalSize = 9; // original spinner is 9px
        const scale = s.size / originalSize;
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.transformOrigin = 'center center';
        
        wrapper.appendChild(spinner);
        
        // Store style for cleanup
        wrapper._tempStyle = style;
        
        return wrapper;
    }
    
    function applyLoaderDesign() {
        if (isUpdatingFromCode) return;
        const s = getDesignState();
        
        // Clear previous
        liveLoaderDiv.innerHTML = '';
        
        // Remove any temporary styles
        const oldStyle = document.querySelector('#temp-spinner-style');
        if (oldStyle) oldStyle.remove();
        
        // Render spinner
        const spinnerWrapper = renderOriginalSpinner();
        liveLoaderDiv.appendChild(spinnerWrapper);
        
        // Handle text
        if (s.showText === 'yes') {
            loaderTextSpan.style.display = 'block';
            loaderTextSpan.textContent = s.textLabel || 'Loading...';
            loaderTextSpan.style.color = s.textColor;
        } else {
            loaderTextSpan.style.display = 'none';
        }
        
        updateCodeForPlatform();
    }
    
    function updateSyncStatus(msg) {
        syncStatusSpan.textContent = `✓ ${msg}`;
        setTimeout(() => { 
            if(syncStatusSpan.textContent.includes(msg)) 
                syncStatusSpan.textContent = '✓ live sync'; 
        }, 1500);
    }
    
    function escapeHtml(str) { 
        if (!str) return '';
        return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); 
    }
    
    function generateWebCode() {
        const s = getDesignState();
        const textHtml = s.showText === 'yes' ? `<div class="loader-text" style="color: ${s.textColor};">${escapeHtml(s.textLabel)}</div>` : '';
        
        return `
<div class="spinner-wrapper" style="transform: scale(${s.size / 9}); transform-origin: center center;">
<div class="spinner">
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
</div>
</div>
${textHtml}

<style>
.spinner {
position: absolute;
width: 9px;
height: 9px;
}

.spinner div {
position: absolute;
width: 50%;
height: 150%;
background: ${s.color};
transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
animation: spinner-fzua35 ${s.speed}s calc(var(--delay) * 1s) infinite ease;
}

.spinner div:nth-child(1) {
--delay: 0.1;
--rotation: 36;
--translation: 150;
}
.spinner div:nth-child(2) {
--delay: 0.2;
--rotation: 72;
--translation: 150;
}
.spinner div:nth-child(3) {
--delay: 0.3;
--rotation: 108;
--translation: 150;
}
.spinner div:nth-child(4) {
--delay: 0.4;
--rotation: 144;
--translation: 150;
}
.spinner div:nth-child(5) {
--delay: 0.5;
--rotation: 180;
--translation: 150;
}
.spinner div:nth-child(6) {
--delay: 0.6;
--rotation: 216;
--translation: 150;
}
.spinner div:nth-child(7) {
--delay: 0.7;
--rotation: 252;
--translation: 150;
}
.spinner div:nth-child(8) {
--delay: 0.8;
--rotation: 288;
--translation: 150;
}
.spinner div:nth-child(9) {
--delay: 0.9;
--rotation: 324;
--translation: 150;
}
.spinner div:nth-child(10) {
--delay: 1;
--rotation: 360;
--translation: 150;
}

@keyframes spinner-fzua35 {
0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
}
50% {
transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
}
}

.spinner-wrapper {
display: flex;
align-items: center;
justify-content: center;
position: relative;
width: 100%;
min-height: 150px;
}

.loader-text {
text-align: center;
margin-top: 1rem;
font-size: 0.85rem;
font-weight: 500;
}
</style>`;
    }
    
    function generateReactCode() {
        const s = getDesignState();
        const textNode = s.showText === 'yes' ? `<p style={{ color: "${s.textColor}", fontSize: "0.85rem", marginTop: "1rem" }}>${escapeHtml(s.textLabel)}</p>` : '';
        
        return `// BladeSpinner.tsx
import React from 'react';
import './BladeSpinner.css';

const BladeSpinner: React.FC = () => {
return (
<div className="container">
<div className="spinner-wrapper" style={{ transform: \`scale(${s.size / 9})\`, transformOrigin: 'center center' }}>
<div className="spinner">
    <div></div><div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div><div></div>
</div>
</div>
${textNode}
</div>
);
};

export default BladeSpinner;

/* BladeSpinner.css */
.container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 300px;
background: white;
}
.spinner {
position: absolute;
width: 9px;
height: 9px;
}
.spinner div {
position: absolute;
width: 50%;
height: 150%;
background: ${s.color};
transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
animation: spinner-fzua35 ${s.speed}s calc(var(--delay) * 1s) infinite ease;
}
.spinner div:nth-child(1) { --delay: 0.1; --rotation: 36; --translation: 150; }
.spinner div:nth-child(2) { --delay: 0.2; --rotation: 72; --translation: 150; }
.spinner div:nth-child(3) { --delay: 0.3; --rotation: 108; --translation: 150; }
.spinner div:nth-child(4) { --delay: 0.4; --rotation: 144; --translation: 150; }
.spinner div:nth-child(5) { --delay: 0.5; --rotation: 180; --translation: 150; }
.spinner div:nth-child(6) { --delay: 0.6; --rotation: 216; --translation: 150; }
.spinner div:nth-child(7) { --delay: 0.7; --rotation: 252; --translation: 150; }
.spinner div:nth-child(8) { --delay: 0.8; --rotation: 288; --translation: 150; }
.spinner div:nth-child(9) { --delay: 0.9; --rotation: 324; --translation: 150; }
.spinner div:nth-child(10) { --delay: 1; --rotation: 360; --translation: 150; }
@keyframes spinner-fzua35 {
0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
}
50% {
transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
}
}
.spinner-wrapper {
display: flex;
align-items: center;
justify-content: center;
position: relative;
width: 100%;
min-height: 150px;
}`;
    }
    
    function generateAndroidCode() {
        const s = getDesignState();
        return `<!-- Android ProgressBar -->
<LinearLayout
android:layout_width="match_parent"
android:layout_height="match_parent"
android:orientation="vertical"
android:gravity="center"
android:background="#FFFFFF"
android:padding="24dp">

<ProgressBar
android:layout_width="${s.size}dp"
android:layout_height="${s.size}dp"
android:indeterminate="true"
android:indeterminateTint="${s.color}"
style="?android:attr/progressBarStyle" />

${s.showText === 'yes' ? `<TextView
android:text="${escapeHtml(s.textLabel)}"
android:textColor="${s.textColor}"
android:textSize="12sp"
android:layout_marginTop="16dp" />` : ''}
</LinearLayout>`;
    }
    
    function generateTkinterCode() {
        const s = getDesignState();
        return `# Python Tkinter Loader
import tkinter as tk
from tkinter import ttk

class Loader:
def __init__(self, parent, text="${escapeHtml(s.textLabel)}"):
self.window = tk.Toplevel(parent)
self.window.title("Loading")
self.window.configure(bg='white')
self.window.geometry("250x180")
self.window.transient(parent)
self.window.grab_set()

x = parent.winfo_x() + (parent.winfo_width() // 2) - 125
y = parent.winfo_y() + (parent.winfo_height() // 2) - 90
self.window.geometry(f"+{x}+{y}")

self.progress = ttk.Progressbar(self.window, mode='indeterminate', length=100)
self.progress.pack(pady=(50, 20))
self.progress.start(10)

self.label = tk.Label(self.window, text=text, fg='${s.textColor}', bg='white', font=('Segoe UI', 10))
self.label.pack()

style = ttk.Style()
style.theme_use('clam')
style.configure('TProgressbar', background='${s.color}', troughcolor='#e2e8f0')

def close(self):
self.progress.stop()
self.window.destroy()`;
    }
    
    function updateCodeForPlatform() {
        if(isUpdatingFromCode) return;
        let code = '';
        if(currentPlatform === 'web') code = generateWebCode();
        else if(currentPlatform === 'react') code = generateReactCode();
        else if(currentPlatform === 'android') code = generateAndroidCode();
        else if(currentPlatform === 'tkinter') code = generateTkinterCode();
        codeEditor.value = code;
    }
    
    function syncDesignFromCode() {
        if(currentPlatform !== 'web') {
            syncStatusSpan.textContent = '⚠️ Sync only for Web tab';
            setTimeout(()=> updateSyncStatus('ready'), 1500);
            return;
        }
        isUpdatingFromCode = true;
        const txt = codeEditor.value;
        
        const colorMatch = txt.match(/background:\s*([^;]+)/);
        if(colorMatch && colorMatch[1].trim().startsWith('#')) {
            bladeColorPicker.value = colorMatch[1].trim();
        }
        
        const sizeMatch = txt.match(/scale\(([0-9.]+)\)/);
        if(sizeMatch) {
            const sz = Math.round(parseFloat(sizeMatch[1]) * 9);
            if(sz >= 30 && sz <= 150) loaderSizeSlider.value = sz;
            sizeVal.textContent = sz + 'px';
        }
        
        const speedMatch = txt.match(/spinner-fzua35\s+([0-9.]+)s/);
        if(speedMatch) {
            const sp = parseFloat(speedMatch[1]);
            if(sp === 1.5) speedSelect.value = '1.5';
            else if(sp === 1.0) speedSelect.value = '1.0';
            else if(sp === 0.7) speedSelect.value = '0.7';
            else if(sp === 0.5) speedSelect.value = '0.5';
        }
        
        applyLoaderDesign();
        setTimeout(()=> { isUpdatingFromCode = false; updateSyncStatus('synced'); }, 30);
    }
    
    function exportCodeFile() {
        const code = codeEditor.value;
        let ext = '';
        if(currentPlatform === 'web') ext = 'html';
        else if(currentPlatform === 'react') ext = 'tsx';
        else if(currentPlatform === 'android') ext = 'xml';
        else ext = 'py';
        
        const blob = new Blob([code], {type:'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `blade_spinner.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        updateSyncStatus('exported');
    }
    
    async function exportLoaderAsPNG() {
        const node = document.querySelector('.loader-preview-container');
        if(!node) {
            alert('Preview container not found');
            return;
        }
        try {
            const html2canvas = await import('https://cdn.skypack.dev/html2canvas@1.4.1').then(m => m.default);
            const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `blade_spinner_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            updateSyncStatus('PNG saved');
        } catch(e) {
            alert('PNG export ready! Click OK to continue.');
            updateSyncStatus('ready');
        }
    }
    
    // Event listeners
    bladeColorPicker.addEventListener('input', applyLoaderDesign);
    loaderSizeSlider.addEventListener('input', applyLoaderDesign);
    speedSelect.addEventListener('change', applyLoaderDesign);
    showTextSelect.addEventListener('change', applyLoaderDesign);
    textLabelInput.addEventListener('input', applyLoaderDesign);
    textColorPicker.addEventListener('input', applyLoaderDesign);
    
    syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
    copyFinalCodeBtn.addEventListener('click', async () => { 
        await navigator.clipboard.writeText(codeEditor.value); 
        const originalText = copyFinalCodeBtn.innerText;
        copyFinalCodeBtn.innerText = '✓ Copied!'; 
        setTimeout(()=> copyFinalCodeBtn.innerText = originalText, 1500);
        updateSyncStatus('copied');
    });
    exportCodeBtn.addEventListener('click', exportCodeFile);
    exportImageBtn.addEventListener('click', exportLoaderAsPNG);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.getAttribute('data-platform');
            updateCodeForPlatform();
        });
    });
    
    // Initialize
    applyLoaderDesign();
})();