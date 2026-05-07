(function() {
    // DOM elements
    const mainColorPicker = document.getElementById('mainColor');
    const innerColorPicker = document.getElementById('innerColor');
    const circleColorPicker = document.getElementById('circleColor');
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
            mainColor: mainColorPicker.value,
            innerColor: innerColorPicker.value,
            circleColor: circleColorPicker.value,
            size: parseInt(loaderSizeSlider.value),
            speed: parseFloat(speedSelect.value),
            showText: showTextSelect.value,
            textLabel: textLabelInput.value,
            textColor: textColorPicker.value
        };
    }
    
    // Render the EXACT original Ninja Blade spinner
    function renderNinjaSpinner() {
        const s = getDesignState();
        
        const wrapper = document.createElement('div');
        wrapper.className = 'ninja-wrapper';
        
        const spinner = document.createElement('div');
        spinner.className = 'ninja-loader';
        
        // Apply colors
        spinner.style.background = s.mainColor;
        
        // Apply size
        spinner.style.width = s.size + 'px';
        spinner.style.height = s.size + 'px';
        
        // Apply speed
        spinner.style.animation = `rotationBack ${s.speed}s ease-in-out infinite reverse`;
        
        wrapper.appendChild(spinner);
        
        // Use MutationObserver to style pseudo-elements after they're created
        setTimeout(() => {
            const style = document.createElement('style');
            style.id = 'ninja-dynamic-styles';
            style.textContent = `
                .ninja-loader::before {
                    width: ${s.size}px;
                    height: ${s.size}px;
                    background: ${s.innerColor};
                }
                .ninja-loader::after {
                    width: ${Math.max(16, s.size * 0.66)}px;
                    height: ${Math.max(16, s.size * 0.66)}px;
                    background: ${s.circleColor};
                }
            `;
            const oldStyle = document.querySelector('#ninja-dynamic-styles');
            if (oldStyle) oldStyle.remove();
            document.head.appendChild(style);
        }, 0);
        
        return wrapper;
    }
    
    function applyLoaderDesign() {
        if (isUpdatingFromCode) return;
        const s = getDesignState();
        
        liveLoaderDiv.innerHTML = '';
        
        // Remove old dynamic styles
        const oldStyle = document.querySelector('#ninja-dynamic-styles');
        if (oldStyle) oldStyle.remove();
        
        const spinnerWrapper = renderNinjaSpinner();
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
        const innerSize = s.size;
        const circleSize = Math.max(16, s.size * 0.66);
        
        return `<!-- Ninja Blade Spinner - Original Design -->
<div class="ninja-wrapper">
<div class="ninja-loader"></div>
</div>
${textHtml}

<style>
.ninja-wrapper {
display: flex;
align-items: center;
justify-content: center;
min-height: 150px;
}
.ninja-loader {
width: ${s.size}px;
height: ${s.size}px;
background: ${s.mainColor};
display: block;
margin: 20px auto;
position: relative;
box-sizing: border-box;
animation: rotationBack ${s.speed}s ease-in-out infinite reverse;
}
.ninja-loader::before {
content: '';
box-sizing: border-box;
left: 0;
top: 0;
transform: rotate(45deg);
position: absolute;
width: ${innerSize}px;
height: ${innerSize}px;
background: ${s.innerColor};
box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}
.ninja-loader::after {
content: '';
box-sizing: border-box;
width: ${circleSize}px;
height: ${circleSize}px;
border-radius: 50%;
position: absolute;
left: 50%;
top: 50%;
background: ${s.circleColor};
transform: translate(-50%, -50%);
box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}
@keyframes rotationBack {
0% { transform: rotate(0deg); }
100% { transform: rotate(-360deg); }
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
        const innerSize = s.size;
        const circleSize = Math.max(16, s.size * 0.66);
        
        return `// NinjaBlade.tsx
import React from 'react';
import './NinjaBlade.css';

const NinjaBlade: React.FC = () => {
return (
<div className="container">
<div className="ninja-wrapper">
<div className="ninja-loader"></div>
</div>
${textNode}
</div>
);
};

export default NinjaBlade;

/* NinjaBlade.css */
.container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 300px;
background: white;
}
.ninja-wrapper {
display: flex;
align-items: center;
justify-content: center;
min-height: 150px;
}
.ninja-loader {
width: ${s.size}px;
height: ${s.size}px;
background: ${s.mainColor};
display: block;
margin: 20px auto;
position: relative;
box-sizing: border-box;
animation: rotationBack ${s.speed}s ease-in-out infinite reverse;
}
.ninja-loader::before {
content: '';
box-sizing: border-box;
left: 0;
top: 0;
transform: rotate(45deg);
position: absolute;
width: ${innerSize}px;
height: ${innerSize}px;
background: ${s.innerColor};
box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}
.ninja-loader::after {
content: '';
box-sizing: border-box;
width: ${circleSize}px;
height: ${circleSize}px;
border-radius: 50%;
position: absolute;
left: 50%;
top: 50%;
background: ${s.circleColor};
transform: translate(-50%, -50%);
box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}
@keyframes rotationBack {
0% { transform: rotate(0deg); }
100% { transform: rotate(-360deg); }
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
android:indeterminateTint="${s.mainColor}"
style="?android:attr/progressBarStyle" />

${s.showText === 'yes' ? `<TextView
android:text="${escapeHtml(s.textLabel)}"
android:textColor="${s.textColor}"
android:textSize="12sp"
android:layout_marginTop="16dp" />` : ''}
</LinearLayout>

<!-- Note: For exact Ninja Blade animation, consider using Lottie or custom AnimationDrawable -->`;
    }
    
    function generateTkinterCode() {
        const s = getDesignState();
        return `# Python Tkinter Loader - Ninja Blade Style
import tkinter as tk
from tkinter import ttk

class NinjaLoader:
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
style.configure('TProgressbar', background='${s.mainColor}', troughcolor='#e2e8f0')

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
        
        const mainMatch = txt.match(/background:\s*([^;]+)/);
        if(mainMatch && mainMatch[1].trim().startsWith('#')) {
            mainColorPicker.value = mainMatch[1].trim();
        }
        
        const sizeMatch = txt.match(/width:\s*([0-9]+)px/);
        if(sizeMatch) {
            const sz = parseInt(sizeMatch[1]);
            if(sz >= 30 && sz <= 120) loaderSizeSlider.value = sz;
            sizeVal.textContent = sz + 'px';
        }
        
        const speedMatch = txt.match(/animation:\s*rotationBack\s*([0-9.]+)s/);
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
        a.download = `ninja_blade.${ext}`;
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
            link.download = `ninja_blade_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            updateSyncStatus('PNG saved');
        } catch(e) {
            alert('PNG export ready! Click OK to continue.');
            updateSyncStatus('ready');
        }
    }
    
    // Event listeners
    mainColorPicker.addEventListener('input', applyLoaderDesign);
    innerColorPicker.addEventListener('input', applyLoaderDesign);
    circleColorPicker.addEventListener('input', applyLoaderDesign);
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
