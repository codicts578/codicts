(function() {
// DOM elements references
const textColorPicker = document.getElementById('textColor');
const placeholderColorPicker = document.getElementById('placeholderColor');
const borderColorPicker = document.getElementById('borderColor');
const glowColorPicker = document.getElementById('glowColor');
const borderRadiusSelect = document.getElementById('borderRadius');
const inputWidthSlider = document.getElementById('inputWidth');
const widthValSpan = document.getElementById('widthVal');
const paddingXSlider = document.getElementById('paddingX');
const paddingYSlider = document.getElementById('paddingY');
const paddingXValSpan = document.getElementById('paddingXVal');
const paddingYValSpan = document.getElementById('paddingYVal');
const fontSizeSelect = document.getElementById('fontSize');
const glowIntensitySelect = document.getElementById('glowIntensity');
const borderWidthSelect = document.getElementById('borderWidth');
const placeholderTextInput = document.getElementById('placeholderText');
const inputTypeSelect = document.getElementById('inputType');

const liveInput = document.getElementById('liveInput');
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
        textColor: textColorPicker.value,
        placeholderColor: placeholderColorPicker.value,
        borderColor: borderColorPicker.value,
        glowColor: glowColorPicker.value,
        borderRadius: borderRadiusSelect.value,
        width: inputWidthSlider.value + 'px',
        paddingX: paddingXSlider.value + 'px',
        paddingY: paddingYSlider.value + 'px',
        fontSize: fontSizeSelect.value,
        glowIntensity: glowIntensitySelect.value,
        borderWidth: borderWidthSelect.value,
        placeholder: placeholderTextInput.value,
        inputType: inputTypeSelect.value
    };
}

function applyInputDesign() {
    if (isUpdatingFromCode) return;
    const s = getDesignState();
    // apply to live element
    liveInput.style.color = s.textColor;
    liveInput.style.borderColor = s.borderColor;
    liveInput.style.borderWidth = s.borderWidth;
    liveInput.style.borderRadius = s.borderRadius;
    liveInput.style.maxWidth = s.width;
    liveInput.style.padding = `${s.paddingY} ${s.paddingX}`;
    liveInput.style.fontSize = s.fontSize;
    liveInput.placeholder = s.placeholder;
    liveInput.type = s.inputType;
    
    // dynamic focus glow via style tag 
    const styleTag = document.getElementById('dynamic-input-styles');
    styleTag.innerHTML = `
        .aurora-input::placeholder {
            color: ${s.placeholderColor};
            opacity: 1;
        }
        .aurora-input:focus {
            border-color: ${s.glowColor} !important;
            box-shadow: 0 0 0 ${s.glowIntensity} ${s.glowColor}33 !important;
            transform: scale(1.02);
        }
    `;
    updateCodeForPlatform();
}

function updateSyncStatus(msg, isError = false) {
    syncStatusSpan.textContent = isError ? `⚠️ ${msg}` : `✓ ${msg}`;
    setTimeout(() => {
        if (syncStatusSpan.textContent.includes(msg)) syncStatusSpan.textContent = '✓ live sync';
    }, 1800);
}

function escapeHtml(str) { 
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); 
}
function escapeXml(str) { 
    return str.replace(/[<>&'"]/g, function(c) {
        if(c === '<') return '&lt;'; if(c === '>') return '&gt;'; if(c === '&') return '&amp;';
        if(c === "'") return '&apos;'; return '&quot;';
    }); 
}

// ---- code generators ----
function generateWebCode() {
    const s = getDesignState();
    return `<!-- Aurora Glow Input Component (White Background) -->
<input type="${s.inputType}" class="aurora-input" placeholder="${escapeHtml(s.placeholder)}" style="width:100%;">

<style>
.aurora-input {
max-width: ${s.width};
padding: ${s.paddingY} ${s.paddingX};
font-size: ${s.fontSize};
border: ${s.borderWidth} solid ${s.borderColor};
border-radius: ${s.borderRadius};
background: white;
color: ${s.textColor};
outline: none;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
font-family: 'Inter', sans-serif;
letter-spacing: 0.5px;
width: 100%;
}
.aurora-input::placeholder {
color: ${s.placeholderColor};
font-weight: 400;
}
.aurora-input:focus {
border-color: ${s.glowColor};
box-shadow: 0 0 0 ${s.glowIntensity} ${s.glowColor}33;
transform: scale(1.02);
}
</style>`;
}

function generateReactCode() {
    const s = getDesignState();
    return `// AuroraGlowInput.tsx - Clean White Background
import React, { useState } from 'react';

interface AuroraGlowInputProps {
type?: string;
placeholder?: string;
}

const AuroraGlowInput: React.FC<AuroraGlowInputProps> = ({ 
type = "${s.inputType}",
placeholder = "${escapeHtml(s.placeholder)}"
}) => {
const [value, setValue] = useState('');
const [isFocused, setIsFocused] = useState(false);

const baseStyle = {
maxWidth: '${s.width}',
padding: '${s.paddingY} ${s.paddingX}',
fontSize: '${s.fontSize}',
border: '${s.borderWidth} solid ${s.borderColor}',
borderRadius: '${s.borderRadius}',
background: 'white',
color: '${s.textColor}',
outline: 'none',
transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
fontFamily: "'Inter', sans-serif",
letterSpacing: '0.5px',
width: '100%'
};

const focusStyle = {
borderColor: '${s.glowColor}',
boxShadow: '0 0 0 ${s.glowIntensity} ${s.glowColor}33',
transform: 'scale(1.02)'
};

return (
<>
    <style>{\`.aurora-input::placeholder { color: ${s.placeholderColor}; opacity: 1; }\`}</style>
    <input 
        type={type}
        className="aurora-input"
        style={{ ...baseStyle, ...(isFocused ? focusStyle : {}) }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
    />
</>
);
};
export default AuroraGlowInput;`;
}

function generateAndroidCode() {
    const s = getDesignState();
    let radiusDp = "50";
    if (s.borderRadius === "8px") radiusDp = "8";
    else if (s.borderRadius === "16px") radiusDp = "16";
    else if (s.borderRadius === "30px") radiusDp = "30";
    else radiusDp = "50";
    const borderWidthDp = parseInt(s.borderWidth) || 2;
    return `<!-- Android EditText with Aurora Glow style -->
<EditText
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:layout_margin="16dp"
android:maxWidth="${parseInt(s.width)}dp"
android:inputType="${s.inputType === 'email' ? 'textEmailAddress' : (s.inputType === 'password' ? 'textPassword' : 'text')}"
android:textColor="${s.textColor}"
android:paddingHorizontal="${parseInt(s.paddingX)}dp"
android:paddingVertical="${parseInt(s.paddingY)}dp"
android:textSize="${parseInt(s.fontSize)}sp"
android:hint="${escapeXml(s.placeholder)}"
android:textColorHint="${s.placeholderColor}"
android:background="@drawable/rounded_edittext_aurora" />

<!-- Create rounded_edittext_aurora.xml in res/drawable/ -->
<shape xmlns:android="http://schemas.android.com/apk/res/android"
android:shape="rectangle">
<solid android:color="#FFFFFF" />
<stroke android:width="${borderWidthDp}dp" android:color="${s.borderColor}" />
<corners android:radius="${radiusDp}dp" />
</shape>`;
}

function generateTkinterCode() {
    const s = getDesignState();
    const fontSizeNum = parseInt(s.fontSize) || 16;
    const padXnum = parseInt(s.paddingX) || 20;
    const padYnum = parseInt(s.paddingY) || 12;
    const borderWidthNum = s.borderWidth === "1px" ? 1 : (s.borderWidth === "3px" ? 3 : 2);
    const focusBorderWidth = borderWidthNum < 3 ? borderWidthNum + 1 : borderWidthNum;
    return `# Python Tkinter Aurora Glow Input (White background)
import tkinter as tk

class AuroraGlowInput(tk.Frame):
def __init__(self, parent, placeholder="${s.placeholder}", **kwargs):
super().__init__(parent, **kwargs)
self.entry = tk.Entry(
    self, 
    font=("Segoe UI", ${fontSizeNum}), 
    fg="${s.textColor}",
    bg="white",
    relief="solid",
    bd=${borderWidthNum},
    highlightthickness=2,
    highlightcolor="${s.glowColor}",
    highlightbackground="${s.borderColor}"
)
self.entry.pack(fill="x", padx=10, pady=8, ipadx=${padXnum}, ipady=${padYnum})
self.entry.insert(0, placeholder)
self.entry.config(fg="${s.placeholderColor}")
self.placeholder = placeholder
self.entry.bind("<FocusIn>", self.on_focus)
self.entry.bind("<FocusOut>", self.on_blur)

def on_focus(self, event):
if self.entry.get() == self.placeholder:
    self.entry.delete(0, tk.END)
    self.entry.config(fg="${s.textColor}")
# Inject the pre-calculated JS values here
self.entry.config(highlightbackground="${s.glowColor}", bd=${focusBorderWidth})

def on_blur(self, event):
if not self.entry.get():
    self.entry.insert(0, self.placeholder)
    self.entry.config(fg="${s.placeholderColor}")
self.entry.config(highlightbackground="${s.borderColor}", bd=${borderWidthNum})

def get(self):
if self.entry.get() == self.placeholder:
    return ""
return self.entry.get()


# Usage example:
# root = tk.Tk()
# widget = AuroraGlowInput(root)
# widget.pack(padx=30, pady=30)
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
        updateSyncStatus('Sync only works on Web tab', true);
        return;
    }
    isUpdatingFromCode = true;
    const txt = codeEditor.value;
    // extract core design tokens 
    const colorMatch = txt.match(/color:\s*([^;]+)/);
    if (colorMatch && colorMatch[1].trim().startsWith('#')) textColorPicker.value = colorMatch[1].trim();
    const borderColorMatch = txt.match(/border:\s*[^;]+\s+solid\s+([^;]+)/);
    if (borderColorMatch && borderColorMatch[1].trim().startsWith('#')) borderColorPicker.value = borderColorMatch[1].trim();
    const glowMatch = txt.match(/box-shadow:\s*0\s*0\s*0\s*([^;]+)/);
    if (glowMatch) {
        let intens = glowMatch[1].trim();
        if (intens === '2px') glowIntensitySelect.value = '2px';
        else if (intens === '4px') glowIntensitySelect.value = '4px';
        else if (intens === '6px') glowIntensitySelect.value = '6px';
        else if (intens === '8px') glowIntensitySelect.value = '8px';
        else glowIntensitySelect.value = '4px';
    }
    const placeholderMatch = txt.match(/placeholder="([^"]+)"/);
    if (placeholderMatch) placeholderTextInput.value = placeholderMatch[1];
    const typeMatch = txt.match(/type\s*=\s*["']([^"']+)["']/);
    if (typeMatch && ['text','email','password','tel'].includes(typeMatch[1])) inputTypeSelect.value = typeMatch[1];
    
    applyInputDesign();
    setTimeout(() => { isUpdatingFromCode = false; updateSyncStatus('synced from code'); }, 30);
}

function exportCodeFile() {
    const code = codeEditor.value;
    let ext = currentPlatform === 'web' ? 'html' : (currentPlatform === 'react' ? 'tsx' : (currentPlatform === 'android' ? 'xml' : 'py'));
    const blob = new Blob([code], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `aurora_glow_input.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
    updateSyncStatus('exported');
}

async function exportInputAsPNG() {
    const node = document.getElementById('previewContainer');
    if (!node) return;
    try {
        // Check if html2canvas is loaded
        if (typeof html2canvas === 'undefined') {
            updateSyncStatus('Waiting for library...', true);
            return;
        }
        const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = `aurora_input_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        updateSyncStatus('PNG saved');
    } catch(e) {
        console.error(e);
        updateSyncStatus('PNG failed', true);
    }
}

// event listeners
const allInputs = [textColorPicker, placeholderColorPicker, borderColorPicker, glowColorPicker, borderRadiusSelect, inputWidthSlider, paddingXSlider, paddingYSlider, fontSizeSelect, glowIntensitySelect, borderWidthSelect, placeholderTextInput, inputTypeSelect];
allInputs.forEach(el => el.addEventListener('input', applyInputDesign));
allInputs.forEach(el => el.addEventListener('change', applyInputDesign));

inputWidthSlider.addEventListener('input', () => { widthValSpan.innerText = inputWidthSlider.value + 'px'; });
paddingXSlider.addEventListener('input', () => { paddingXValSpan.innerText = paddingXSlider.value + 'px'; });
paddingYSlider.addEventListener('input', () => { paddingYValSpan.innerText = paddingYSlider.value + 'px'; });

syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
copyFinalCodeBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(codeEditor.value);
    copyFinalCodeBtn.innerText = '✓ Copied!';
    setTimeout(() => copyFinalCodeBtn.innerText = '📋 Copy Code', 1500);
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

// initial apply
applyInputDesign();
})();