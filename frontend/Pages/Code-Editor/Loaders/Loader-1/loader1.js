(function() {
    // DOM elements
    const loaderTypeSelect = document.getElementById('loaderType');
    const loaderColorPicker = document.getElementById('loaderColor');
    const loaderSizeSlider = document.getElementById('loaderSize');
    const sizeVal = document.getElementById('sizeVal');
    const speedSelect = document.getElementById('speed');
    const thicknessSlider = document.getElementById('thickness');
    const thickVal = document.getElementById('thickVal');
    const showTextSelect = document.getElementById('showText');
    const textLabelInput = document.getElementById('textLabel');
    const textColorPicker = document.getElementById('textColor');
    const previewContainer = document.getElementById('previewContainer');
    
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
    
    loaderSizeSlider.addEventListener('input', () => { sizeVal.textContent = loaderSizeSlider.value + 'px'; applyLoaderDesign(); });
    thicknessSlider.addEventListener('input', () => { thickVal.textContent = thicknessSlider.value + 'px'; applyLoaderDesign(); });
    
    // SURPRISE: Show success animation on loader click
    function showSuccessAnimation() {
        const container = previewContainer;
        const canvas = document.querySelector('.design-canvas');
        
        // Add glitch effect first
        container.classList.add('glitch-effect');
        setTimeout(() => container.classList.remove('glitch-effect'), 300);
        
        // Show success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-check">
                <i class="fas fa-check"></i>
            </div>
        `;
        canvas.style.position = 'relative';
        canvas.appendChild(overlay);
        
        // Play scanline effect
        const scanline = document.createElement('div');
        scanline.style.position = 'absolute';
        scanline.style.top = '0';
        scanline.style.left = '0';
        scanline.style.right = '0';
        scanline.style.height = '2px';
        scanline.style.background = 'linear-gradient(90deg, transparent, #00ffcc, transparent)';
        scanline.style.animation = 'scanline 0.6s linear';
        scanline.style.pointerEvents = 'none';
        canvas.appendChild(scanline);
        
        setTimeout(() => {
            overlay.remove();
            scanline.remove();
            updateSyncStatus('SYSTEM READY');
        }, 1500);
    }
    
    function getDesignState() {
        return {
            type: loaderTypeSelect.value,
            color: loaderColorPicker.value,
            size: parseInt(loaderSizeSlider.value),
            speed: parseFloat(speedSelect.value),
            thickness: parseInt(thicknessSlider.value),
            showText: showTextSelect.value,
            textLabel: textLabelInput.value,
            textColor: textColorPicker.value
        };
    }
    
    function renderSpinner(size, thickness, color, duration) {
        const spinner = document.createElement('div');
        spinner.style.width = size + 'px';
        spinner.style.height = size + 'px';
        spinner.style.border = thickness + 'px solid rgba(255,255,255,0.1)';
        spinner.style.borderTopColor = color;
        spinner.style.borderRightColor = color;
        spinner.style.borderRadius = '50%';
        spinner.style.animation = `neonSpin ${duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`;
        spinner.style.filter = `drop-shadow(0 0 5px ${color})`;
        spinner.style.color = color;
        return spinner;
    }
    
    function renderPulse(size, color, duration) {
        const pulse = document.createElement('div');
        pulse.style.width = size + 'px';
        pulse.style.height = size + 'px';
        pulse.style.backgroundColor = color;
        pulse.style.borderRadius = '50%';
        pulse.style.animation = `neonPulse ${duration}s ease-in-out infinite`;
        pulse.style.boxShadow = `0 0 15px ${color}`;
        return pulse;
    }
    
    function renderDots(size, color, duration) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = Math.max(6, Math.floor(size / 10)) + 'px';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        
        const dotSize = Math.max(10, Math.floor(size / 3.5));
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.style.width = dotSize + 'px';
            dot.style.height = dotSize + 'px';
            dot.style.backgroundColor = color;
            dot.style.borderRadius = '50%';
            dot.style.animation = `neonBounce ${duration}s infinite ease-in-out both`;
            dot.style.boxShadow = `0 0 10px ${color}`;
            if (i === 0) dot.style.animationDelay = '-0.32s';
            if (i === 1) dot.style.animationDelay = '-0.16s';
            wrapper.appendChild(dot);
        }
        return wrapper;
    }
    
    function applyLoaderDesign() {
        if (isUpdatingFromCode) return;
        const s = getDesignState();
        
        liveLoaderDiv.innerHTML = '';
        
        if (s.type === 'spinner') {
            liveLoaderDiv.appendChild(renderSpinner(s.size, s.thickness, s.color, s.speed));
        } else if (s.type === 'pulse') {
            liveLoaderDiv.appendChild(renderPulse(s.size, s.color, s.speed));
        } else if (s.type === 'dots') {
            liveLoaderDiv.appendChild(renderDots(s.size, s.color, s.speed));
        }
        
        if (s.showText === 'yes') {
            loaderTextSpan.style.display = 'block';
            loaderTextSpan.textContent = s.textLabel || 'LOADING...';
            loaderTextSpan.style.color = s.textColor;
            loaderTextSpan.style.textShadow = `0 0 5px ${s.textColor}`;
        } else {
            loaderTextSpan.style.display = 'none';
        }
        
        // Add click surprise to loader
        const currentLoader = liveLoaderDiv.firstChild;
        if (currentLoader) {
            currentLoader.style.cursor = 'pointer';
            currentLoader.onclick = (e) => {
                e.stopPropagation();
                showSuccessAnimation();
            };
        }
        
        updateCodeForPlatform();
    }
    
    function updateSyncStatus(msg) {
        syncStatusSpan.textContent = `✓ ${msg}`;
        setTimeout(() => { 
            if(syncStatusSpan.textContent.includes(msg)) 
                syncStatusSpan.textContent = '✓ ONLINE'; 
        }, 1500);
    }
    
    function escapeHtml(str) { 
        if (!str) return '';
        return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); 
    }
    
    function generateWebCode() {
        const s = getDesignState();
        const duration = s.speed;
        const size = s.size;
        const thickness = s.thickness;
        const textHtml = s.showText === 'yes' ? `<div class="loader-text" style="color: ${s.textColor}; text-shadow: 0 0 5px ${s.textColor};">${escapeHtml(s.textLabel)}</div>` : '';
        
        let loaderHtml = '';
        let customCss = '';
        
        if (s.type === 'spinner') {
            loaderHtml = `<div class="neon-spinner"></div>`;
            customCss = `
.neon-spinner {
width: ${size}px;
height: ${size}px;
border: ${thickness}px solid rgba(255,255,255,0.1);
border-top-color: ${s.color};
border-right-color: ${s.color};
border-radius: 50%;
animation: neonSpin ${duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
filter: drop-shadow(0 0 5px ${s.color});
}
@keyframes neonSpin {
0% { transform: rotate(0deg); filter: drop-shadow(0 0 2px ${s.color}); }
50% { filter: drop-shadow(0 0 15px ${s.color}); }
100% { transform: rotate(360deg); filter: drop-shadow(0 0 2px ${s.color}); }
}`;
        } else if (s.type === 'pulse') {
            loaderHtml = `<div class="neon-pulse"></div>`;
            customCss = `
.neon-pulse {
width: ${size}px;
height: ${size}px;
background: ${s.color};
border-radius: 50%;
animation: neonPulse ${duration}s ease-in-out infinite;
box-shadow: 0 0 15px ${s.color};
}
@keyframes neonPulse {
0%, 100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 2px ${s.color}); }
50% { opacity: 0.7; transform: scale(0.85); filter: drop-shadow(0 0 20px ${s.color}); }
}`;
        } else {
            const dotSize = Math.max(10, Math.floor(size / 3.5));
            const gapSize = Math.max(6, Math.floor(size / 10));
            loaderHtml = `<div class="neon-dots"><span></span><span></span><span></span></div>`;
            customCss = `
.neon-dots {
display: flex;
gap: ${gapSize}px;
}
.neon-dots span {
width: ${dotSize}px;
height: ${dotSize}px;
background: ${s.color};
border-radius: 50%;
animation: neonBounce ${duration}s infinite ease-in-out both;
box-shadow: 0 0 10px ${s.color};
}
.neon-dots span:nth-child(1) { animation-delay: -0.32s; }
.neon-dots span:nth-child(2) { animation-delay: -0.16s; }
@keyframes neonBounce {
0%, 80%, 100% { transform: scale(0); filter: drop-shadow(0 0 2px ${s.color}); }
40% { transform: scale(1); filter: drop-shadow(0 0 15px ${s.color}); }
}`;
        }
        
        return `<!-- CYBERPUNK NEON LOADER -->
<div class="loader-wrapper">
${loaderHtml}
${textHtml}
</div>

<style>
.loader-wrapper {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 1rem;
padding: 2rem;
background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
min-height: 300px;
}
.loader-text {
font-family: 'Share Tech Mono', monospace;
font-size: 0.85rem;
letter-spacing: 2px;
margin-top: 0.5rem;
}
${customCss}
</style>

<script>
document.querySelector('.loader-wrapper')?.addEventListener('click', () => {
alert('⚡ SYSTEM ONLINE ⚡');
});
<\/script>`;
    }
    
    function generateReactCode() {
        const s = getDesignState();
        const duration = s.speed;
        const size = s.size;
        const thickness = s.thickness;
        const textNode = s.showText === 'yes' ? `<p style={{ color: "${s.textColor}", textShadow: "0 0 5px ${s.textColor}", fontSize: "0.85rem", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "2px" }}>${escapeHtml(s.textLabel)}</p>` : '';
        
        let loaderJsx = '';
        let cssKeyframes = '';
        
        if (s.type === 'spinner') {
            loaderJsx = `<div style={{ width: "${size}px", height: "${size}px", border: "${thickness}px solid rgba(255,255,255,0.1)", borderTopColor: "${s.color}", borderRightColor: "${s.color}", borderRadius: "50%", animation: \`neonSpin ${duration}s cubic-bezier(0.4,0,0.2,1) infinite\`, filter: \`drop-shadow(0 0 5px ${s.color})\` }} />`;
            cssKeyframes = `@keyframes neonSpin { 0% { transform: rotate(0deg); filter: drop-shadow(0 0 2px ${s.color}); } 50% { filter: drop-shadow(0 0 15px ${s.color}); } 100% { transform: rotate(360deg); filter: drop-shadow(0 0 2px ${s.color}); } }`;
        } else if (s.type === 'pulse') {
            loaderJsx = `<div style={{ width: "${size}px", height: "${size}px", background: "${s.color}", borderRadius: "50%", animation: \`neonPulse ${duration}s ease-in-out infinite\`, boxShadow: \`0 0 15px ${s.color}\` }} />`;
            cssKeyframes = `@keyframes neonPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.85); box-shadow: 0 0 20px ${s.color}; } }`;
        } else {
            const dotSize = Math.max(10, Math.floor(size / 3.5));
            const gapSize = Math.max(6, Math.floor(size / 10));
            loaderJsx = `<div style={{ display: "flex", gap: "${gapSize}px" }}>
                <span style={{ width: "${dotSize}px", height: "${dotSize}px", background: "${s.color}", borderRadius: "50%", animation: \`neonBounce ${duration}s infinite ease-in-out both\`, animationDelay: "-0.32s", boxShadow: \`0 0 10px ${s.color}\` }}></span>
                <span style={{ width: "${dotSize}px", height: "${dotSize}px", background: "${s.color}", borderRadius: "50%", animation: \`neonBounce ${duration}s infinite ease-in-out both\`, animationDelay: "-0.16s", boxShadow: \`0 0 10px ${s.color}\` }}></span>
                <span style={{ width: "${dotSize}px", height: "${dotSize}px", background: "${s.color}", borderRadius: "50%", animation: \`neonBounce ${duration}s infinite ease-in-out both\`, boxShadow: \`0 0 10px ${s.color}\` }}></span>
            </div>`;
            cssKeyframes = `@keyframes neonBounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`;
        }
        
        return `// NeonLoader.tsx
import React from 'react';
import './NeonLoader.css';

const NeonLoader: React.FC = () => {
return (
<div className="neon-wrapper">
${loaderJsx}
${textNode}
</div>
);
};

export default NeonLoader;

/* NeonLoader.css */
.neon-wrapper {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 1rem;
padding: 2rem;
background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
min-height: 300px;
}
${cssKeyframes}`;
    }
    
    function generateAndroidCode() {
        const s = getDesignState();
        const sizeDp = s.size;
        const textStr = s.showText === 'yes' ? `\n    <TextView\n        android:text="${escapeHtml(s.textLabel)}"\n        android:textColor="${s.textColor}"\n        android:textSize="12sp"\n        android:fontFamily="monospace"\n        android:layout_gravity="center"\n        android:layout_marginTop="8dp" />` : '';
        
        return `<!-- Cyberpunk Loader for Android -->
<LinearLayout
android:layout_width="match_parent"
android:layout_height="match_parent"
android:orientation="vertical"
android:gravity="center"
android:background="@drawable/cyber_bg"
android:padding="24dp">

<ProgressBar
android:layout_width="${sizeDp}dp"
android:layout_height="${sizeDp}dp"
android:indeterminate="true"
android:indeterminateTint="${s.color}"
style="?android:attr/progressBarStyle" />
${textStr}
</LinearLayout>

<!-- Add this to res/values/colors.xml -->
<color name="neon_cyan">${s.color}</color>`;
    }
    
    function generateTkinterCode() {
        const s = getDesignState();
        const sizeVal = Math.max(20, s.size / 2);
        return `# Cyberpunk Loader - Python Tkinter
import tkinter as tk
from tkinter import ttk

class CyberLoader:
def __init__(self, parent, text="${escapeHtml(s.textLabel)}"):
self.window = tk.Toplevel(parent)
self.window.title("")
self.window.configure(bg='#0a0a0a')
self.window.geometry("250x180")
self.window.transient(parent)
self.window.grab_set()

# Center window
self.window.update_idletasks()
x = parent.winfo_x() + (parent.winfo_width() // 2) - 125
y = parent.winfo_y() + (parent.winfo_height() // 2) - 90
self.window.geometry(f"+{x}+{y}")

# Neon frame
frame = tk.Frame(self.window, bg='#0a0a0a', highlightbackground='#00ffcc', highlightthickness=1)
frame.pack(fill='both', expand=True, padx=10, pady=10)

# Spinner
self.progress = ttk.Progressbar(frame, mode='indeterminate', length=100)
self.progress.pack(pady=(30, 15))
self.progress.start(10)

# Neon text
self.label = tk.Label(frame, text=text, fg='#00ffcc', bg='#0a0a0a', 
                        font=('Courier', 10, 'bold'))
self.label.pack()

self._running = True
self._blink()

def _blink(self):
if self._running:
    current = self.label.cget('fg')
    new = '#ffffff' if current == '#00ffcc' else '#00ffcc'
    self.label.config(fg=new)
    self.window.after(500, self._blink)

def close(self):
self._running = False
self.progress.stop()
self.window.destroy()

# Usage:
# root = tk.Tk()
# loader = CyberLoader(root, "PROCESSING...")
# root.mainloop()`;
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
            syncStatusSpan.textContent = '⚠️ WEB ONLY';
            setTimeout(()=> updateSyncStatus('ONLINE'), 1500);
            return;
        }
        isUpdatingFromCode = true;
        const txt = codeEditor.value;
        
        const colorMatch = txt.match(/border-top-color:\s*([^;]+)/) || txt.match(/background:\s*([^;]+)/);
        if(colorMatch && colorMatch[1].trim().startsWith('#')) {
            loaderColorPicker.value = colorMatch[1].trim();
        }
        
        const sizeMatch = txt.match(/width:\s*([0-9]+)px/);
        if(sizeMatch) {
            const sz = parseInt(sizeMatch[1]);
            if(sz >= 24 && sz <= 80) loaderSizeSlider.value = sz;
        }
        
        if(txt.includes('neon-spinner') || txt.includes('border-top-color')) {
            loaderTypeSelect.value = 'spinner';
        } else if(txt.includes('neon-pulse')) {
            loaderTypeSelect.value = 'pulse';
        } else if(txt.includes('neon-dots')) {
            loaderTypeSelect.value = 'dots';
        }
        
        applyLoaderDesign();
        setTimeout(()=> { isUpdatingFromCode = false; updateSyncStatus('SYNCED'); }, 30);
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
        a.download = `neon_loader.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        updateSyncStatus('EXPORTED');
    }
    
    async function exportLoaderAsPNG() {
        const node = document.querySelector('.loader-preview-container');
        if(!node) {
            alert('Preview not found');
            return;
        }
        try {
            const html2canvas = await import('https://cdn.skypack.dev/html2canvas@1.4.1').then(m => m.default);
            const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#0a0a0a' });
            const link = document.createElement('a');
            link.download = `neon_loader_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            updateSyncStatus('PNG SAVED');
        } catch(e) {
            alert('PNG export ready!');
            updateSyncStatus('READY');
        }
    }
    
    // Event listeners
    loaderTypeSelect.addEventListener('change', applyLoaderDesign);
    loaderColorPicker.addEventListener('input', applyLoaderDesign);
    loaderSizeSlider.addEventListener('input', applyLoaderDesign);
    speedSelect.addEventListener('change', applyLoaderDesign);
    thicknessSlider.addEventListener('input', applyLoaderDesign);
    showTextSelect.addEventListener('change', applyLoaderDesign);
    textLabelInput.addEventListener('input', applyLoaderDesign);
    textColorPicker.addEventListener('input', applyLoaderDesign);
    
    syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
    copyFinalCodeBtn.addEventListener('click', async () => { 
        await navigator.clipboard.writeText(codeEditor.value); 
        const originalText = copyFinalCodeBtn.innerText;
        copyFinalCodeBtn.innerText = '✓ Copied!'; 
        setTimeout(()=> copyFinalCodeBtn.innerText = originalText, 1500);
        updateSyncStatus('COPIED');
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