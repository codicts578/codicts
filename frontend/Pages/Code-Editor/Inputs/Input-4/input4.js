(function() {
    // DOM Elements
    const textColor = document.getElementById('textColor');
    const placeholderColor = document.getElementById('placeholderColor');
    const borderColor = document.getElementById('borderColor');
    const gradientStart = document.getElementById('gradientStart');
    const gradientMid = document.getElementById('gradientMid');
    const gradientEnd = document.getElementById('gradientEnd');
    const borderHeight = document.getElementById('borderHeight');
    const underlineHeight = document.getElementById('underlineHeight');
    const inputWidth = document.getElementById('inputWidth');
    const widthVal = document.getElementById('widthVal');
    const fontSize = document.getElementById('fontSize');
    const paddingX = document.getElementById('paddingX');
    const paddingY = document.getElementById('paddingY');
    const paddingXVal = document.getElementById('paddingXVal');
    const paddingYVal = document.getElementById('paddingYVal');
    const animSpeed = document.getElementById('animSpeed');
    const placeholderText = document.getElementById('placeholderText');
    const inputType = document.getElementById('inputType');
    
    const liveInput = document.getElementById('liveInput');
    const liveBorder = document.getElementById('liveBorder');
    const codeEditor = document.getElementById('codeEditor');
    const syncFromCodeBtn = document.getElementById('syncFromCodeBtn');
    const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    let isUpdatingFromCode = false;
    
    function getDesignState() {
        return {
            textColor: textColor.value,
            placeholderColor: placeholderColor.value,
            borderColor: borderColor.value,
            gradientStart: gradientStart.value,
            gradientMid: gradientMid.value,
            gradientEnd: gradientEnd.value,
            borderHeight: borderHeight.value,
            underlineHeight: underlineHeight.value,
            width: inputWidth.value + 'px',
            fontSize: fontSize.value,
            paddingX: paddingX.value + 'px',
            paddingY: paddingY.value + 'px',
            animSpeed: animSpeed.value,
            placeholder: placeholderText.value,
            inputType: inputType.value
        };
    }
    
    function applyInputDesign() {
        if (isUpdatingFromCode) return;
        const s = getDesignState();
        liveInput.style.color = s.textColor;
        liveInput.style.borderBottom = `${s.borderHeight} solid ${s.borderColor}`;
        liveInput.style.fontSize = s.fontSize;
        liveInput.style.paddingInline = s.paddingX;
        liveInput.style.paddingBlock = s.paddingY;
        liveInput.placeholder = s.placeholder;
        liveInput.type = s.inputType;
        const gradient = `linear-gradient(90deg, ${s.gradientStart}, ${s.gradientMid}, ${s.gradientEnd})`;
        liveBorder.style.background = gradient;
        liveBorder.style.height = s.underlineHeight;
        liveBorder.style.transition = `width ${s.animSpeed} cubic-bezier(0.42, 0, 0.58, 1)`;
        const styleTag = document.getElementById('dynamic-input-styles');
        styleTag.innerHTML = ` .gradient-input::placeholder { color: ${s.placeholderColor}; opacity: 1; } `;
        updateCodeForPlatform();
    }
    
    function updateSyncStatus(msg, isError = false) {
        syncStatusSpan.textContent = isError ? `⚠️ ${msg}` : `✓ ${msg}`;
        setTimeout(() => { if(syncStatusSpan.textContent.includes(msg)) syncStatusSpan.textContent = '✓ ready'; }, 1800);
    }
    
    function escapeHtml(str) { 
        if(!str) return '';
        return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); 
    }
    function escapeXml(str) { return str.replace(/[<>&'"]/g, function(c) { if(c === '<') return '&lt;'; if(c === '>') return '&gt;'; if(c === '&') return '&amp;'; if(c === "'") return '&apos;'; return '&quot;'; }); }
    
    function generateWebCode() {
        const s = getDesignState();
        const gradient = `linear-gradient(90deg, ${s.gradientStart}, ${s.gradientMid}, ${s.gradientEnd})`;
        return `<!-- Gradient Underline Input (Web Component) -->
<input type="${s.inputType}" class="gradient-input" placeholder="${escapeHtml(s.placeholder)}" required>
<span class="input-border"></span>
</div>

<style>
.gradient-input {
color: ${s.textColor}; font-size: ${s.fontSize}; background: transparent;
width: 100%; box-sizing: border-box; padding-inline: ${s.paddingX}; padding-block: ${s.paddingY};
border: none; border-bottom: ${s.borderHeight} solid ${s.borderColor};
outline: none; font-family: 'Inter', sans-serif;
}
.gradient-input::placeholder { color: ${s.placeholderColor}; opacity: 1; }
.input-border {
position: absolute; bottom: 0; left: 0; width: 0%; height: ${s.underlineHeight};
background: ${gradient}; transition: width ${s.animSpeed} cubic-bezier(0.42, 0, 0.58, 1);
}
.gradient-input:focus + .input-border { width: 100%; }
</style>`;
    }
    
    function generateReactCode() {
        const s = getDesignState();
        const gradient = `linear-gradient(90deg, ${s.gradientStart}, ${s.gradientMid}, ${s.gradientEnd})`;
        return `// GradientUnderlineInput.tsx
import React, { useState } from 'react';
const GradientUnderlineInput = ({ type = "${s.inputType}", placeholder = "${escapeHtml(s.placeholder)}" }) => {
const [value, setValue] = useState('');
const [focused, setFocused] = useState(false);
return (
<div style={{ position: 'relative', maxWidth: '${s.width}', margin: '0 auto' }}>
    <input
    type={type}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)}
    placeholder={placeholder}
    style={{
        color: '${s.textColor}', fontSize: '${s.fontSize}', background: 'transparent',
        width: '100%', paddingInline: '${s.paddingX}', paddingBlock: '${s.paddingY}',
        border: 'none', borderBottom: '${s.borderHeight} solid ${s.borderColor}',
        outline: 'none', fontFamily: "'Inter', sans-serif"
    }}
    />
    <span style={{
    position: 'absolute', bottom: 0, left: 0,
    width: focused ? '100%' : '0%', height: '${s.underlineHeight}',
    background: '${gradient}', transition: 'width ${s.animSpeed} cubic-bezier(0.42, 0, 0.58, 1)'
    }} />
</div>
);
};
export default GradientUnderlineInput;
/* CSS for placeholder: .gradient-input::placeholder { color: ${s.placeholderColor}; } */`;
    }
    
    function generateAndroidCode() {
        const s = getDesignState();
        return `<!-- Android Material Design EditText (XML) -->
<com.google.android.material.textfield.TextInputLayout
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:layout_margin="16dp"
style="@style/Widget.MaterialComponents.TextInputLayout.OutlinedBox"
app:boxStrokeColor="${s.gradientStart}"
app:hintTextColor="${s.placeholderColor}">

<com.google.android.material.textfield.TextInputEditText
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:inputType="${s.inputType === 'email' ? 'textEmailAddress' : (s.inputType === 'password' ? 'textPassword' : 'text')}"
    android:textColor="${s.textColor}"
    android:textSize="${parseInt(s.fontSize)}sp"
    android:hint="${escapeXml(s.placeholder)}" />
</com.google.android.material.textfield.TextInputLayout>
<!-- Add dependency: implementation 'com.google.android.material:material:1.9.0' -->`;
    }
    
    function generateTkinterCode() {
        const s = getDesignState();
        const fontSizeNum = parseInt(s.fontSize) || 16;
        const padXNum = parseInt(s.paddingX) || 8;
        const padYNum = parseInt(s.paddingY) || 12;
        const underH = parseInt(s.underlineHeight) || 3;
        return `# Tkinter Gradient Underline Input Widget (Python)
import tkinter as tk

class GradientUnderlineInput(tk.Frame):
def __init__(self, parent, placeholder="${escapeHtml(s.placeholder)}", **kwargs):
    super().__init__(parent, **kwargs)
    self.entry = tk.Entry(self, font=("Segoe UI", ${fontSizeNum}), fg="${s.textColor}",
                            bg="white", relief="flat", bd=0, highlightthickness=0)
    self.entry.pack(fill="x", padx=10, pady=(8,4), ipadx=${padXNum}, ipady=${padYNum})
    self.entry.insert(0, placeholder)
    self.entry.config(fg="${s.placeholderColor}")
    self.underline = tk.Frame(self, height=${underH}, bg="${s.borderColor}")
    self.underline.pack(fill="x", padx=10)
    self.entry.bind("<FocusIn>", self.on_focus)
    self.entry.bind("<FocusOut>", self.on_blur)
    self.placeholder = placeholder
def on_focus(self, event):
    if self.entry.get() == self.placeholder:
        self.entry.delete(0, tk.END)
        self.entry.config(fg="${s.textColor}")
    self.underline.config(bg="${s.gradientStart}")
def on_blur(self, event):
    if not self.entry.get():
        self.entry.insert(0, self.placeholder)
        self.entry.config(fg="${s.placeholderColor}")
    self.underline.config(bg="${s.borderColor}")
def get(self):
    return "" if self.entry.get() == self.placeholder else self.entry.get()

# Usage:
# root = tk.Tk()
# widget = GradientUnderlineInput(root)
# widget.pack(padx=20, pady=20)
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
            updateSyncStatus('Sync only works on Web tab', true);
            return;
        }
        isUpdatingFromCode = true;
        const txt = codeEditor.value;
        const colorMatch = txt.match(/color:\s*([^;]+)/);
        if(colorMatch && colorMatch[1].trim().startsWith('#')) textColor.value = colorMatch[1].trim();
        const borderMatch = txt.match(/border-bottom:\s*[^;]+\s+solid\s+([^;]+)/);
        if(borderMatch && borderMatch[1].trim().startsWith('#')) borderColor.value = borderMatch[1].trim();
        const gradMatch = txt.match(/linear-gradient\(90deg,\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
        if(gradMatch) {
            gradientStart.value = gradMatch[1].trim();
            gradientMid.value = gradMatch[2].trim();
            gradientEnd.value = gradMatch[3].trim();
        }
        const phMatch = txt.match(/placeholder="([^"]+)"/);
        if(phMatch) placeholderText.value = phMatch[1];
        const typeMatch = txt.match(/type\s*=\s*["']([^"']+)["']/);
        if(typeMatch && ['text','email','password','tel'].includes(typeMatch[1])) inputType.value = typeMatch[1];
        applyInputDesign();
        setTimeout(() => { isUpdatingFromCode = false; updateSyncStatus('synced from code'); }, 50);
    }
    
    function exportCodeFile() {
        const code = codeEditor.value;
        let ext = currentPlatform === 'web' ? 'html' : (currentPlatform === 'react' ? 'tsx' : (currentPlatform === 'android' ? 'xml' : 'py'));
        const blob = new Blob([code], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `gradient_underline.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        updateSyncStatus('exported');
    }
    
    async function exportInputAsPNG() {
        const node = document.querySelector('.input-preview-container');
        if(!node) return;
        try {
            const html2canvas = await import('https://cdn.skypack.dev/html2canvas@1.4.1').then(m => m.default);
            const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `gradient_input_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            updateSyncStatus('PNG saved');
        } catch(e) {
            alert('PNG export simulated: use any screenshot library');
            updateSyncStatus('ready');
        }
    }
    
    // Events
    const allInputs = [textColor, placeholderColor, borderColor, gradientStart, gradientMid, gradientEnd, borderHeight, underlineHeight, inputWidth, fontSize, paddingX, paddingY, animSpeed, placeholderText, inputType];
    allInputs.forEach(el => el.addEventListener('input', applyInputDesign));
    allInputs.forEach(el => el.addEventListener('change', applyInputDesign));
    inputWidth.addEventListener('input', () => { widthVal.innerText = inputWidth.value+'px'; });
    paddingX.addEventListener('input', () => { paddingXVal.innerText = paddingX.value+'px'; });
    paddingY.addEventListener('input', () => { paddingYVal.innerText = paddingY.value+'px'; });
    
    syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
    copyFinalCodeBtn.addEventListener('click', async () => { 
        await navigator.clipboard.writeText(codeEditor.value);
        copyFinalCodeBtn.innerText = '✅ Copied!';
        setTimeout(()=> copyFinalCodeBtn.innerText = '📋 Copy Code', 1500);
        updateSyncStatus('copied');
    });
    exportCodeBtn.addEventListener('click', exportCodeFile);
    exportImageBtn.addEventListener('click', exportInputAsPNG);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.getAttribute('data-platform');
            updateCodeForPlatform();
        });
    });
    applyInputDesign();
})();