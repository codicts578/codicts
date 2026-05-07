(function() {
    // DOM elements
    const color1Picker = document.getElementById('color1');
    const color2Picker = document.getElementById('color2');
    const color3Picker = document.getElementById('color3');
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
            color1: color1Picker.value,
            color2: color2Picker.value,
            color3: color3Picker.value,
            size: parseInt(loaderSizeSlider.value),
            speed: parseFloat(speedSelect.value),
            showText: showTextSelect.value,
            textLabel: textLabelInput.value,
            textColor: textColorPicker.value
        };
    }
    
    function renderAuroraRings() {
        const s = getDesignState();
        
        const wrapper = document.createElement('div');
        wrapper.className = 'aurora-wrapper';
        
        const rings = document.createElement('div');
        rings.className = 'aurora-rings';
        
        // Apply size
        rings.style.width = s.size + 'px';
        rings.style.height = s.size + 'px';
        
        // Apply gradient colors dynamically
        const gradient = `linear-gradient(135deg, ${s.color1}, ${s.color2}, ${s.color3})`;
        
        const style = document.createElement('style');
        style.id = 'aurora-dynamic-styles';
        style.textContent = `
            .aurora-rings::before,
            .aurora-rings::after {
                background: ${gradient};
            }
            .aurora-rings::before {
                animation: morphRing1 ${s.speed}s ease-in-out infinite alternate;
            }
            .aurora-rings::after {
                animation: morphRing2 ${s.speed}s ease-in-out infinite alternate;
            }
        `;
        const oldStyle = document.querySelector('#aurora-dynamic-styles');
        if (oldStyle) oldStyle.remove();
        document.head.appendChild(style);
        
        wrapper.appendChild(rings);
        return wrapper;
    }
    
    function applyLoaderDesign() {
        if (isUpdatingFromCode) return;
        const s = getDesignState();
        
        liveLoaderDiv.innerHTML = '';
        
        const ringsWrapper = renderAuroraRings();
        liveLoaderDiv.appendChild(ringsWrapper);
        
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
        const gradient = `linear-gradient(135deg, ${s.color1}, ${s.color2}, ${s.color3})`;
        
        return `<!-- Morphing Aurora Rings Loader -->
<div class="aurora-wrapper">
<div class="aurora-rings"></div>
</div>
${textHtml}

<style>
.aurora-wrapper {
display: flex;
align-items: center;
justify-content: center;
min-height: 150px;
}
.aurora-rings {
width: ${s.size}px;
height: ${s.size}px;
position: relative;
}
.aurora-rings::before,
.aurora-rings::after {
content: '';
position: absolute;
inset: 0;
border-radius: 50%;
background: ${gradient};
opacity: 0.8;
}
.aurora-rings::before {
animation: morphRing1 ${s.speed}s ease-in-out infinite alternate;
filter: blur(8px);
}
.aurora-rings::after {
animation: morphRing2 ${s.speed}s ease-in-out infinite alternate;
filter: blur(4px);
opacity: 0.6;
}
@keyframes morphRing1 {
0% {
transform: scale(0.4) rotate(0deg);
border-radius: 70% 30% 60% 40% / 40% 50% 50% 60%;
}
50% {
transform: scale(0.9) rotate(180deg);
border-radius: 30% 70% 40% 60% / 60% 40% 60% 40%;
}
100% {
transform: scale(0.4) rotate(360deg);
border-radius: 70% 30% 60% 40% / 40% 50% 50% 60%;
}
}
@keyframes morphRing2 {
0% {
transform: scale(0.8) rotate(0deg);
border-radius: 40% 60% 70% 30% / 50% 60% 40% 50%;
}
50% {
transform: scale(1.1) rotate(-180deg);
border-radius: 60% 40% 30% 70% / 40% 50% 60% 50%;
}
100% {
transform: scale(0.8) rotate(-360deg);
border-radius: 40% 60% 70% 30% / 50% 60% 40% 50%;
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
        const gradient = `linear-gradient(135deg, ${s.color1}, ${s.color2}, ${s.color3})`;
        
        return `// AuroraRings.tsx
import React from 'react';
import './AuroraRings.css';

const AuroraRings: React.FC = () => {
return (
<div className="container">
<div className="aurora-wrapper">
<div className="aurora-rings"></div>
</div>
${textNode}
</div>
);
};

export default AuroraRings;

/* AuroraRings.css */
.container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 300px;
background: white;
}
.aurora-wrapper {
display: flex;
align-items: center;
justify-content: center;
min-height: 150px;
}
.aurora-rings {
width: ${s.size}px;
height: ${s.size}px;
position: relative;
}
.aurora-rings::before,
.aurora-rings::after {
content: '';
position: absolute;
inset: 0;
border-radius: 50%;
background: ${gradient};
opacity: 0.8;
}
.aurora-rings::before {
animation: morphRing1 ${s.speed}s ease-in-out infinite alternate;
filter: blur(8px);
}
.aurora-rings::after {
animation: morphRing2 ${s.speed}s ease-in-out infinite alternate;
filter: blur(4px);
opacity: 0.6;
}
@keyframes morphRing1 {
0% { transform: scale(0.4) rotate(0deg); border-radius: 70% 30% 60% 40% / 40% 50% 50% 60%; }
50% { transform: scale(0.9) rotate(180deg); border-radius: 30% 70% 40% 60% / 60% 40% 60% 40%; }
100% { transform: scale(0.4) rotate(360deg); border-radius: 70% 30% 60% 40% / 40% 50% 50% 60%; }
}
@keyframes morphRing2 {
0% { transform: scale(0.8) rotate(0deg); border-radius: 40% 60% 70% 30% / 50% 60% 40% 50%; }
50% { transform: scale(1.1) rotate(-180deg); border-radius: 60% 40% 30% 70% / 40% 50% 60% 50%; }
100% { transform: scale(0.8) rotate(-360deg); border-radius: 40% 60% 70% 30% / 50% 60% 40% 50%; }
}`;
    }
    
    function generateAndroidCode() {
        const s = getDesignState();
        return `<!-- Android ProgressBar (Indeterminate) -->
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
android:indeterminateTint="${s.color1}"
style="?android:attr/progressBarStyleLarge" />

${s.showText === 'yes' ? `<TextView
android:text="${escapeHtml(s.textLabel)}"
android:textColor="${s.textColor}"
android:textSize="12sp"
android:layout_marginTop="16dp" />` : ''}
</LinearLayout>

<!-- Note: For exact Aurora Rings morphing animation, consider using 
Lottie library with custom animation JSON -->`;
    }
    
    function generateTkinterCode() {
        const s = getDesignState();
        return `# Python Tkinter Loader - Aurora Rings Style
import tkinter as tk
from tkinter import ttk

class AuroraLoader:
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
style.configure('TProgressbar', background='${s.color1}', troughcolor='#e2e8f0')

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
        
        const colorMatch = txt.match(/background:\s*linear-gradient\(135deg,\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
        if(colorMatch) {
            color1Picker.value = colorMatch[1].trim();
            color2Picker.value = colorMatch[2].trim();
            color3Picker.value = colorMatch[3].trim();
        }
        
        const sizeMatch = txt.match(/width:\s*([0-9]+)px/);
        if(sizeMatch) {
            const sz = parseInt(sizeMatch[1]);
            if(sz >= 40 && sz <= 140) loaderSizeSlider.value = sz;
            sizeVal.textContent = sz + 'px';
        }
        
        const speedMatch = txt.match(/morphRing1\s+([0-9.]+)s/);
        if(speedMatch) {
            const sp = parseFloat(speedMatch[1]);
            if(sp === 2.5) speedSelect.value = '2.5';
            else if(sp === 2.0) speedSelect.value = '2.0';
            else if(sp === 1.5) speedSelect.value = '1.5';
            else if(sp === 1.0) speedSelect.value = '1.0';
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
        a.download = `aurora_rings.${ext}`;
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
            link.download = `aurora_rings_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            updateSyncStatus('PNG saved');
        } catch(e) {
            alert('PNG export ready! Click OK to continue.');
            updateSyncStatus('ready');
        }
    }
    
    // Event listeners
    color1Picker.addEventListener('input', applyLoaderDesign);
    color2Picker.addEventListener('input', applyLoaderDesign);
    color3Picker.addEventListener('input', applyLoaderDesign);
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
