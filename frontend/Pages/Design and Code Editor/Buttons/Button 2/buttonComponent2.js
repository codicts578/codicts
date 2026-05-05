(function() {
    // DOM elements
    const liveButton = document.getElementById('liveButton');
    const buttonSpan = document.getElementById('buttonTextSpan');
    const btnSvg = liveButton.querySelector('svg');
    const btnPolyline = btnSvg.querySelector('polyline');
    
    const btnBorderColor = document.getElementById('btnBorderColor');
    const btnHoverBg = document.getElementById('btnHoverBg');
    const btnLabel = document.getElementById('btnLabel');
    const btnTextColor = document.getElementById('btnTextColor');
    const btnWidth = document.getElementById('btnWidth');
    const btnHeight = document.getElementById('btnHeight');
    const widthVal = document.getElementById('widthVal');
    const heightVal = document.getElementById('heightVal');
    const animSpeed = document.getElementById('animSpeed');
    const speedVal = document.getElementById('speedVal');
    
    const codeEditor = document.getElementById('codeEditor');
    const syncFromCodeBtn = document.getElementById('syncFromCodeBtn');
    const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    let isUpdatingFromCode = false;
    let isUpdatingFromDesign = false;
    
    // Helper Functions
    function escapeHtml(str) { 
        return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); 
    }
    
    function getDesign() {
        return {
            borderColor: btnBorderColor.value,
            hoverBg: btnHoverBg.value,
            label: btnLabel.value,
            textColor: btnTextColor.value,
            width: btnWidth.value + 'px',
            height: btnHeight.value + 'px',
            widthNum: btnWidth.value,
            heightNum: btnHeight.value,
            speed: animSpeed.value + 's'
        };
    }
    
    // Apply design to live button
    function applyDesign() {
        if (isUpdatingFromCode) return;
        isUpdatingFromDesign = true;
        
        const d = getDesign();
        
        // Update button styles
        liveButton.style.width = d.width;
        liveButton.style.height = d.height;
        liveButton.style.borderColor = d.borderColor;
        liveButton.style.transition = d.speed;
        
        // Update SVG
        btnSvg.setAttribute('width', d.widthNum);
        btnSvg.setAttribute('height', d.heightNum);
        btnSvg.setAttribute('viewBox', `0 0 ${d.widthNum} ${d.heightNum}`);
        btnPolyline.setAttribute('points', `${d.widthNum-1},1 ${d.widthNum-1},${d.heightNum-1} 1,${d.heightNum-1} 1,1 ${d.widthNum-1},1`);
        btnSvg.style.transition = d.speed;
        
        // Update text
        buttonSpan.textContent = d.label;
        buttonSpan.style.color = d.textColor;
        
        // Update hover style
        let styleEl = document.getElementById('dynamic-btn-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'dynamic-btn-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .animated-svg-btn:hover {
                transition: ${d.speed} ease-in-out;
                background: ${d.hoverBg};
            }
            .animated-svg-btn:hover svg {
                stroke-dashoffset: -480;
                transition: ${d.speed} ease-in-out;
            }
            .animated-svg-btn {
                transition: ${d.speed} ease-in-out;
            }
        `;
        
        // Update display values
        widthVal.textContent = d.width;
        heightVal.textContent = d.height;
        speedVal.textContent = d.speed;
        
        isUpdatingFromDesign = false;
        updateCodeForPlatform();
        updateSyncStatus('design → code');
    }
    
    // Generate Web Code
    function generateWebCode() {
        const d = getDesign();
        return `<!-- Animated SVG Border Button -->
<button class="animated-border-btn" id="coolButton">
<svg width="${d.widthNum}" height="${d.heightNum}" viewBox="0 0 ${d.widthNum} ${d.heightNum}">
<polyline points="${d.widthNum-1},1 ${d.widthNum-1},${d.heightNum-1} 1,${d.heightNum-1} 1,1 ${d.widthNum-1},1" />
</svg>
<span>${escapeHtml(d.label)}</span>
</button>

<style>
.animated-border-btn {
width: ${d.width};
height: ${d.height};
cursor: pointer;
background: transparent;
border: 1px solid ${d.borderColor};
outline: none;
transition: ${d.speed} ease-in-out;
position: relative;
display: inline-block;
}
.animated-border-btn svg {
position: absolute;
left: 0;
top: 0;
fill: none;
stroke: #fff;
stroke-dasharray: 150 480;
stroke-dashoffset: 150;
transition: ${d.speed} ease-in-out;
}
.animated-border-btn:hover {
transition: ${d.speed} ease-in-out;
background: ${d.hoverBg};
}
.animated-border-btn:hover svg {
stroke-dashoffset: -480;
}
.animated-border-btn span {
color: ${d.textColor};
font-size: 18px;
font-weight: 100;
position: relative;
z-index: 1;
}
</style>

<script>
document.getElementById('coolButton')?.addEventListener('click', () => {
alert('Button clicked! 🎉');
});
<\/script>`;
    }
    
    // Generate React Code
    function generateReactCode() {
        const d = getDesign();
        return `// React + TypeScript Animated Button Component
// File: AnimatedBorderButton.tsx

import React from 'react';

interface AnimatedButtonProps {
onClick?: () => void;
children?: React.ReactNode;
}

const AnimatedBorderButton: React.FC<AnimatedButtonProps> = ({ onClick, children }) => {
const buttonStyles: React.CSSProperties = {
width: '${d.width}',
height: '${d.height}',
cursor: 'pointer',
background: 'transparent',
border: \`1px solid ${d.borderColor}\`,
outline: 'none',
transition: '${d.speed} ease-in-out',
position: 'relative',
display: 'inline-block'
};

return (
<button 
style={buttonStyles}
className="animated-btn-react"
onClick={onClick}
>
<svg 
width={${d.widthNum}} 
height={${d.heightNum}} 
viewBox={\`0 0 ${d.widthNum} ${d.heightNum}\`}
style={{
    position: 'absolute',
    left: 0,
    top: 0,
    fill: 'none',
    stroke: '#fff',
    strokeDasharray: '150 480',
    strokeDashoffset: 150,
    transition: '${d.speed} ease-in-out'
}}
>
<polyline points={\`${d.widthNum-1},1 ${d.widthNum-1},${d.heightNum-1} 1,${d.heightNum-1} 1,1 ${d.widthNum-1},1\`} />
</svg>
<span style={{ color: '${d.textColor}', fontSize: '18px', fontWeight: 100, position: 'relative', zIndex: 1 }}>
{children || '${escapeHtml(d.label)}'}
</span>
</button>
);
};

export default AnimatedBorderButton;

/* Add this to your CSS file: */
/*
.animated-btn-react:hover {
background: ${d.hoverBg};
transition: ${d.speed} ease-in-out;
}
.animated-btn-react:hover svg {
stroke-dashoffset: -480;
}
*/`;
    }
    
    // Generate Android Code
    function generateAndroidCode() {
        const d = getDesign();
        return `// Android Studio - Custom Border Button
// Not directly translatable to native Android XML
// Recommended: Use WebView or create custom drawable

// For a similar effect, create a custom Button class in Kotlin:

class AnimatedBorderButton @JvmOverloads constructor(
context: Context,
attrs: AttributeSet? = null
) : AppCompatButton(context, attrs) {

init {
background = null
setPadding(0, 0, 0, 0)
}

override fun onDraw(canvas: Canvas) {
// Custom drawing for border animation
// Similar to SVG stroke-dashoffset effect
}
}

// Layout XML:
<com.yourapp.AnimatedBorderButton
android:layout_width="${d.widthNum}dp"
android:layout_height="${d.heightNum}dp"
android:text="${escapeHtml(d.label)}"
android:textColor="${d.textColor}"
android:textSize="18sp" />`;
    }
    
    // Generate Tkinter Code
    function generateTkinterCode() {
        const d = getDesign();
        return `# Python Tkinter - Custom Animated Button
# For full SVG-like animation, consider using customtkinter or tkinter with canvas

import tkinter as tk

class AnimatedButton(tk.Canvas):
def __init__(self, parent, text="${escapeHtml(d.label)}", command=None):
super().__init__(parent, width=${d.widthNum}, height=${d.heightNum}, highlightthickness=0)
self.command = command

# Draw border and text
self.create_rectangle(1, 1, ${d.widthNum-1}, ${d.heightNum-1}, 
                        outline="${d.borderColor}", fill="", tags="border")
self.create_text(${d.widthNum/2}, ${d.heightNum/2}, 
                text=text, fill="${d.textColor}", font=("Arial", 14), tags="text")

self.bind("<Enter>", self.on_enter)
self.bind("<Leave>", self.on_leave)
self.bind("<Button-1>", self.on_click)

def on_enter(self, e):
self.itemconfig("border", fill="${d.hoverBg}")

def on_leave(self, e):
self.itemconfig("border", fill="")

def on_click(self, e):
if self.command:
    self.command()

# Usage:
# root = tk.Tk()
# btn = AnimatedButton(root, text="Click Me", command=lambda: print("Clicked"))
# btn.pack(pady=20)
# root.mainloop()`;
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
    
    function syncDesignFromCode() {
        if (currentPlatform !== 'web') {
            syncStatusSpan.textContent = '⚠️ Sync only for Web tab';
            setTimeout(() => updateSyncStatus('live sync'), 1500);
            return;
        }
        // Basic sync functionality
        syncStatusSpan.textContent = '✓ Sync feature ready';
    }
    
    function updateSyncStatus(msg) {
        syncStatusSpan.textContent = `✓ ${msg}`;
        setTimeout(() => { 
            if(syncStatusSpan.textContent.includes(msg)) 
                syncStatusSpan.textContent = '✓ live sync'; 
        }, 1500);
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
    
    async function exportDesignAsImage() {
        const buttonElement = liveButton;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const rect = buttonElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Draw background
        ctx.fillStyle = '#5CA4EA';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw button appearance
        ctx.fillStyle = getComputedStyle(buttonElement).backgroundColor;
        ctx.strokeStyle = btnBorderColor.value;
        ctx.lineWidth = 2;
        ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
        
        ctx.fillStyle = btnTextColor.value;
        ctx.font = '18px Lato';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btnLabel.value, canvas.width/2, canvas.height/2);
        
        canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `button_design_${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(link.href);
            updateSyncStatus('PNG exported');
        }, 'image/png');
    }
    
    // Event listeners
    btnBorderColor.addEventListener('input', applyDesign);
    btnHoverBg.addEventListener('input', applyDesign);
    btnLabel.addEventListener('input', applyDesign);
    btnTextColor.addEventListener('input', applyDesign);
    btnWidth.addEventListener('input', applyDesign);
    btnHeight.addEventListener('input', applyDesign);
    animSpeed.addEventListener('input', applyDesign);
    
    liveButton.addEventListener('click', () => alert('✨ Animated SVG Button | Customize & Copy Code!'));
    syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
    copyFinalCodeBtn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(codeEditor.value);
        const orig = copyFinalCodeBtn.innerText;
        copyFinalCodeBtn.innerText = '✓ Copied!';
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
    
    // Initialize
    applyDesign();
})();