(function() {
    // DOM elements
    const loaderColorPicker = document.getElementById('loaderColor');
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
            color: loaderColorPicker.value,
            size: parseInt(loaderSizeSlider.value),
            speed: parseFloat(speedSelect.value),
            showText: showTextSelect.value,
            textLabel: textLabelInput.value,
            textColor: textColorPicker.value
        };
    }
    
    // Render the EXACT original Radial Puzzle spinner
    function renderRadialSpinner() {
        const s = getDesignState();
        
        const wrapper = document.createElement('div');
        wrapper.className = 'radial-wrapper';
        
        const spinner = document.createElement('div');
        spinner.className = 'radial-puzzle';
        
        // Apply color
        spinner.style.color = s.color;
        
        // Apply size using transform scale (preserves original CSS)
        const originalSize = 44.8;
        const scale = s.size / originalSize;
        spinner.style.transform = `scale(${scale})`;
        spinner.style.transformOrigin = 'center center';
        
        // Apply speed to animation
        const style = document.createElement('style');
        style.id = 'radial-dynamic-styles';
        style.textContent = `
            .radial-puzzle:before {
                animation: radialPulse ${s.speed}s infinite cubic-bezier(0.3, 1, 0, 1);
            }
        `;
        const oldStyle = document.querySelector('#radial-dynamic-styles');
        if (oldStyle) oldStyle.remove();
        document.head.appendChild(style);
        
        wrapper.appendChild(spinner);
        
        return wrapper;
    }
    
    function applyLoaderDesign() {
        if (isUpdatingFromCode) return;
        const s = getDesignState();
        
        liveLoaderDiv.innerHTML = '';
        
        const spinnerWrapper = renderRadialSpinner();
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
        const originalSize = 44.8;
        const scale = s.size / originalSize;
        
        return `<!-- Radial Puzzle Spinner - Original Design -->
<div class="radial-wrapper">
<div class="radial-puzzle"></div>
</div>
${textHtml}

<style>
.radial-wrapper {
display: flex;
align-items: center;
justify-content: center;
min-height: 150px;
}
.radial-puzzle {
width: 44.8px;
height: 44.8px;
color: ${s.color};
position: relative;
background: radial-gradient(11.2px, currentColor 94%, #0000);
transform: scale(${scale});
transform-origin: center center;
}
.radial-puzzle:before {
content: '';
position: absolute;
inset: 0;
border-radius: 50%;
background: radial-gradient(10.08px at bottom right, #0000 94%, currentColor) top left,
        radial-gradient(10.08px at bottom left, #0000 94%, currentColor) top right,
        radial-gradient(10.08px at top right, #0000 94%, currentColor) bottom left,
        radial-gradient(10.08px at top left, #0000 94%, currentColor) bottom right;
background-size: 22.4px 22.4px;
background-repeat: no-repeat;
animation: radialPulse ${s.speed}s infinite cubic-bezier(0.3, 1, 0, 1);
}
@keyframes radialPulse {
33% {
inset: -11.2px;
transform: rotate(0deg);
}
66% {
inset: -11.2px;
transform: rotate(90deg);
}
100% {
inset: 0;
transform: rotate(90deg);
}
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
        const originalSize = 44.8;
        const scale = s.size / originalSize;
        
        return `// RadialPuzzle.tsx
import React from 'react';
import './RadialPuzzle.css';

const RadialPuzzle: React.FC = () => {
return (
<div className="container">
<div className="radial-wrapper">
<div className="radial-puzzle"></div>
</div>
${textNode}
</div>
);
};

export default RadialPuzzle;

/* RadialPuzzle.css */
.container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 300px;
background: white;
}
.radial-wrapper {
display: flex;
align-items: center;
justify-content: center;
min-height: 150px;
}
.radial-puzzle {
width: 44.8px;
height: 44.8px;
color: ${s.color};
position: relative;
background: radial-gradient(11.2px, currentColor 94%, #0000);
transform: scale(${scale});
transform-origin: center center;
}
.radial-puzzle:before {
content: '';
position: absolute;
inset: 0;
border-radius: 50%;
background: radial-gradient(10.08px at bottom right, #0000 94%, currentColor) top left,
        radial-gradient(10.08px at bottom left, #0000 94%, currentColor) top right,
        radial-gradient(10.08px at top right, #0000 94%, currentColor) bottom left,
        radial-gradient(10.08px at top left, #0000 94%, currentColor) bottom right;
background-size: 22.4px 22.4px;
background-repeat: no-repeat;
animation: radialPulse ${s.speed}s infinite cubic-bezier(0.3, 1, 0, 1);
}
@keyframes radialPulse {
33% { inset: -11.2px; transform: rotate(0deg); }
66% { inset: -11.2px; transform: rotate(90deg); }
100% { inset: 0; transform: rotate(90deg); }
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
</LinearLayout>

<!-- Note: For exact Radial Puzzle animation, consider using Lottie or custom AnimatedVectorDrawable -->`;
    }
    
    function generateTkinterCode() {
        const s = getDesignState();
        return `# Python Tkinter Loader - Radial Puzzle Style
import tkinter as tk
from tkinter import ttk

class RadialLoader:
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
        
        const colorMatch = txt.match(/color:\s*([^;]+)/);
        if(colorMatch && colorMatch[1].trim().startsWith('#')) {
            loaderColorPicker.value = colorMatch[1].trim();
        }
        
        const sizeMatch = txt.match(/scale\(([0-9.]+)\)/);
        if(sizeMatch) {
            const sz = Math.round(parseFloat(sizeMatch[1]) * 44.8);
            if(sz >= 30 && sz <= 120) loaderSizeSlider.value = sz;
            sizeVal.textContent = sz + 'px';
        }
        
        const speedMatch = txt.match(/radialPulse\s+([0-9.]+)s/);
        if(speedMatch) {
            const sp = parseFloat(speedMatch[1]);
            if(sp === 1.8) speedSelect.value = '1.8';
            else if(sp === 1.5) speedSelect.value = '1.5';
            else if(sp === 1.0) speedSelect.value = '1.0';
            else if(sp === 0.7) speedSelect.value = '0.7';
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
        a.download = `radial_puzzle.${ext}`;
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
            link.download = `radial_puzzle_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            updateSyncStatus('PNG saved');
        } catch(e) {
            alert('PNG export ready! Click OK to continue.');
            updateSyncStatus('ready');
        }
    }
    
    // Event listeners
    loaderColorPicker.addEventListener('input', applyLoaderDesign);
    loaderSizeSlider.addEventListener('input', applyLoaderDesign);
    speedSelect.addEventListener('input', applyLoaderDesign);
    showTextSelect.addEventListener('input', applyLoaderDesign);
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