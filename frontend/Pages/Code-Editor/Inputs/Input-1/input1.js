(function() {
// DOM elements
const borderColorPicker = document.getElementById('borderColor');
const gradientStartPicker = document.getElementById('gradientStart');
const gradientEndPicker = document.getElementById('gradientEnd');
const labelColorPicker = document.getElementById('labelColor');
const labelFocusColorPicker = document.getElementById('labelFocusColor');
const textColorPicker = document.getElementById('textColor');
const bgColorPicker = document.getElementById('bgColor');
const inputTypeSelect = document.getElementById('inputType');
const inputWidthSlider = document.getElementById('inputWidth');
const widthValSpan = document.getElementById('widthVal');
const fontSizeSelect = document.getElementById('fontSize');
const labelTextInput = document.getElementById('labelText');
const placeholderTextInput = document.getElementById('placeholderText');
const tkPaddingSlider = document.getElementById('tkPadding');
const padValSpan = document.getElementById('padVal');

const liveInput = document.getElementById('liveInput');
const liveLabel = document.getElementById('liveLabel');
const liveGroup = document.getElementById('liveInputGroup');

const codeEditor = document.getElementById('codeEditor');
const syncBtn = document.getElementById('syncFromCodeBtn');
const copyBtn = document.getElementById('copyFinalCodeBtn');
const exportCodeBtn = document.getElementById('exportCodeBtn');
const exportImageBtn = document.getElementById('exportImageBtn');
const syncStatusSpan = document.getElementById('syncStatus');

let currentPlatform = 'web';
let isUpdatingFromCode = false;

tkPaddingSlider.addEventListener('input', () => { 
    padValSpan.innerText = tkPaddingSlider.value + 'px'; 
    if (currentPlatform === 'tkinter') updateCodeForPlatform();
});
inputWidthSlider.addEventListener('input', () => { 
    widthValSpan.innerText = inputWidthSlider.value + 'px'; 
    applyDesign(); 
});

function getDesignState() {
    return {
        borderColor: borderColorPicker.value,
        gradientStart: gradientStartPicker.value,
        gradientEnd: gradientEndPicker.value,
        labelColor: labelColorPicker.value,
        labelFocusColor: labelFocusColorPicker.value,
        textColor: textColorPicker.value,
        bgColor: bgColorPicker.value,
        inputType: inputTypeSelect.value,
        width: inputWidthSlider.value + 'px',
        fontSize: fontSizeSelect.value,
        labelText: labelTextInput.value,
        placeholder: placeholderTextInput.value,
        tkPadding: tkPaddingSlider.value
    };
}

function applyDesign() {
    if (isUpdatingFromCode) return;
    const s = getDesignState();
    const labelBottomOffset = 8;
    
    liveInput.style.borderBottomColor = s.borderColor;
    liveInput.style.color = s.textColor;
    liveInput.style.backgroundColor = s.bgColor;
    liveInput.style.fontSize = s.fontSize;
    liveInput.type = s.inputType;
    liveInput.placeholder = s.placeholder;
    liveGroup.style.maxWidth = s.width;
    liveLabel.textContent = s.labelText;
    liveLabel.style.color = s.labelColor;
    
    const dynamicStyle = document.getElementById('dynamic-input-styles');
    dynamicStyle.innerHTML = `
        .form__field {
            border-bottom-color: ${s.borderColor};
            background: ${s.bgColor};
            color: ${s.textColor};
            font-size: ${s.fontSize};
        }
        .form__field:focus {
            border-image: linear-gradient(to right, ${s.gradientStart}, ${s.gradientEnd}) 1;
            border-image-slice: 1;
            border-bottom-width: 3px;
        }
        .form__label {
            color: ${s.labelColor};
            font-size: ${s.fontSize};
            bottom: ${labelBottomOffset}px;
        }
        .form__field:focus ~ .form__label,
        .form__field:not(:placeholder-shown) ~ .form__label {
            color: ${s.labelFocusColor} !important;
            transform: translateY(-24px) scale(0.85);
            font-weight: 700;
        }
        .form__field:focus {
            border-bottom-color: transparent;
        }
    `;
    
    if (!isUpdatingFromCode && currentPlatform) {
        updateCodeForPlatform();
    }
}

function updateSyncStatus(msg, isErr = false) {
    syncStatusSpan.innerHTML = isErr ? `⚠️ ${msg}` : `✓ ${msg}`;
    syncStatusSpan.style.color = isErr ? '#f97316' : '#10b981';
    setTimeout(() => { 
        if(syncStatusSpan.innerHTML.includes(msg)) 
            syncStatusSpan.innerHTML = '✓ live sync'; 
    }, 1800);
}

function escapeHtml(str) { 
    if(!str) return ''; 
    return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); 
}

function escapeXml(str) { 
    if(!str) return ''; 
    return str.replace(/[<>&'"]/g, c => ({
        '<':'&lt;', '>':'&gt;', '&':'&amp;', 
        "'":'&apos;', '"':'&quot;'
    })[c]); 
}

// ========== ENHANCED TKINTER GENERATOR ==========
function generateTkinterCode() {
    const s = getDesignState();
    const fontSizePx = parseInt(s.fontSize) || 17;
    const padTop = s.tkPadding;
    const gradientColor = s.gradientStart;
    const labelFontSize = Math.max(9, fontSizePx - 4);
    const focusLabelFontSize = Math.max(8, fontSizePx - 6);
    return `# Tkinter Floating Label Input (Enhanced)
import tkinter as tk

class FloatingLabelEntry(tk.Frame):
def __init__(self, parent, label_text="${s.labelText}", placeholder="${s.placeholder}", width=30, **kwargs):
super().__init__(parent, bg="${s.bgColor}", **kwargs)

self.label_text = label_text
self.placeholder = placeholder
self.normal_label_color = "${s.labelColor}"
self.focus_label_color = "${s.labelFocusColor}"

self.label = tk.Label(
    self, text=label_text, 
    font=("Segoe UI", ${labelFontSize}),
    fg=self.normal_label_color, bg="${s.bgColor}"
)
self.label.pack(anchor="w", pady=(0, 2))

self.entry = tk.Entry(
    self, font=("Segoe UI", ${fontSizePx}), 
    fg="${s.textColor}", bg="${s.bgColor}",
    relief="flat", bd=0, highlightthickness=2,
    highlightcolor="${gradientColor}", 
    highlightbackground="${s.borderColor}", width=width
)
self.entry.pack(fill="x", pady=(0, ${padTop}))

self.entry.insert(0, self.placeholder)
self.entry.config(fg="gray")

self.entry.bind("<FocusIn>", self._on_focus_in)
self.entry.bind("<FocusOut>", self._on_focus_out)

def _on_focus_in(self, event):
if self.entry.get() == self.placeholder:
    self.entry.delete(0, tk.END)
    self.entry.config(fg="${s.textColor}")
self.label.config(fg=self.focus_label_color, font=("Segoe UI", ${focusLabelFontSize}))

def _on_focus_out(self, event):
if not self.entry.get():
    self.entry.insert(0, self.placeholder)
    self.entry.config(fg="gray")
    self.label.config(fg=self.normal_label_color, font=("Segoe UI", ${labelFontSize}))

if __name__ == "__main__":
root = tk.Tk()
root.configure(bg="${s.bgColor}")
e = FloatingLabelEntry(root)
e.pack(padx=20, pady=20)
root.mainloop()`;
}

function generateWebCode() {
    const s = getDesignState();
    return `<!-- Floating Label Input - Web Component (Premium Design) -->
<div class="floating-group" style="max-width: ${s.width}; margin: 0 auto;">
<input type="${s.inputType}" class="floating-input" placeholder="${escapeHtml(s.placeholder)}" required>
<label class="floating-label">${escapeHtml(s.labelText)}</label>
</div>

<style>
.floating-group { position: relative; padding: 20px 0 0; width: 100%; }
.floating-input {
font-family: 'Inter', sans-serif;
width: 100%;
border: none;
border-bottom: 2px solid ${s.borderColor};
outline: 0;
font-size: ${s.fontSize};
padding: 10px 0 8px 0;
background: ${s.bgColor};
color: ${s.textColor};
transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
font-weight: 500;
}
.floating-input::placeholder { color: transparent; }
.floating-input:focus {
border-image: linear-gradient(to right, ${s.gradientStart}, ${s.gradientEnd}) 1;
border-image-slice: 1;
border-bottom-width: 3px;
padding-bottom: 6px;
}
.floating-label {
position: absolute;
left: 0;
bottom: 8px;
font-size: ${s.fontSize};
color: ${s.labelColor};
pointer-events: none;
transition: 0.2s cubic-bezier(0.23, 1, 0.32, 1);
font-weight: 500;
transform-origin: left center;
}
.floating-input:focus ~ .floating-label,
.floating-input:not(:placeholder-shown) ~ .floating-label {
transform: translateY(-24px) scale(0.85);
font-weight: 700;
color: ${s.labelFocusColor} !important;
}
</style>`;
}

function generateReactCode() {
    const s = getDesignState();
    return `// FloatingLabelInput.tsx - React Component with Premium Floating Animation
import React, { useState } from 'react';

interface FloatingLabelInputProps {
label?: string;
type?: string;
placeholder?: string;
value?: string;
onChange?: (value: string) => void;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
label = "${escapeHtml(s.labelText)}",
type = "${s.inputType}",
placeholder = "${escapeHtml(s.placeholder)}",
value: externalValue,
onChange,
}) => {
const [internalValue, setInternalValue] = useState('');
const value = externalValue !== undefined ? externalValue : internalValue;

return (
<div className="floating-group" style={{ maxWidth: "${s.width}" }}>
<input
type={type}
className="floating-input"
placeholder={placeholder}
value={value}
onChange={(e) => onChange ? onChange(e.target.value) : setInternalValue(e.target.value)}
required
/>
<label className="floating-label">{label}</label>
</div>
);
};

/* styles.module.css */
/*
.floating-group { position: relative; padding: 20px 0 0; width: 100%; }
.floating-input { font-family: 'Inter', sans-serif; width: 100%; border: none; border-bottom: 2px solid ${s.borderColor}; outline: 0; font-size: ${s.fontSize}; padding: 10px 0 8px 0; background: ${s.bgColor}; color: ${s.textColor}; transition: all 0.3s; }
.floating-input::placeholder { color: transparent; }
.floating-input:focus { border-image: linear-gradient(to right, ${s.gradientStart}, ${s.gradientEnd}) 1; border-image-slice: 1; border-bottom-width: 3px; }
.floating-label { position: absolute; left: 0; bottom: 8px; font-size: ${s.fontSize}; color: ${s.labelColor}; pointer-events: none; transition: 0.2s; }
.floating-input:focus ~ .floating-label,
.floating-input:not(:placeholder-shown) ~ .floating-label { transform: translateY(-24px) scale(0.85); font-weight: 700; color: ${s.labelFocusColor} !important; }
*/`;
}

function generateAndroidCode() {
    const s = getDesignState();
    return `<!-- Android Material Design Floating Label (OutlinedBox) -->
<!-- Add dependency: implementation 'com.google.android.material:material:1.9.0' -->
<com.google.android.material.textfield.TextInputLayout
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:layout_margin="16dp"
android:hint="${escapeXml(s.labelText)}"
app:hintTextColor="${s.labelColor}"
app:boxStrokeColor="${s.borderColor}"
app:boxStrokeWidthFocused="3dp"
app:hintAnimationEnabled="true"
app:boxBackgroundColor="${s.bgColor}"
app:boxCornerRadiusRadius="8dp"
style="@style/Widget.MaterialComponents.TextInputLayout.OutlinedBox">

<com.google.android.material.textfield.TextInputEditText
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:inputType="${s.inputType === 'email' ? 'textEmailAddress' : (s.inputType === 'password' ? 'textPassword' : 'text')}"
android:textColor="${s.textColor}"
android:textSize="${parseInt(s.fontSize)}sp"
android:backgroundTint="${s.bgColor}"
android:hint="${escapeXml(s.placeholder)}" />
</com.google.android.material.textfield.TextInputLayout>`;
}

function updateCodeForPlatform() {
    let code = '';
    if (currentPlatform === 'web') code = generateWebCode();
    else if (currentPlatform === 'react') code = generateReactCode();
    else if (currentPlatform === 'android') code = generateAndroidCode();
    else code = generateTkinterCode();
    codeEditor.value = code;
}

function syncDesignFromCode() {
    if(currentPlatform !== 'web') { 
        updateSyncStatus('Sync only works on Web tab', true); 
        return; 
    }
    isUpdatingFromCode = true;
    const txt = codeEditor.value;
    const borderMatch = txt.match(/border-bottom:\s*2px\s+solid\s+([^;]+)/);
    if(borderMatch && borderMatch[1].trim().startsWith('#')) borderColorPicker.value = borderMatch[1].trim();
    const gradStartMatch = txt.match(/linear-gradient\(to right,\s*([^,]+),/);
    if(gradStartMatch && gradStartMatch[1].trim().startsWith('#')) gradientStartPicker.value = gradStartMatch[1].trim();
    const gradEndMatch = txt.match(/linear-gradient\(to right,\s*[^,]+\s*,\s*([^)]+)/);
    if(gradEndMatch && gradEndMatch[1].trim().startsWith('#')) gradientEndPicker.value = gradEndMatch[1].trim();
    const labelColorMatch = txt.match(/\.floating-label\s*\{\s*[^}]*color:\s*([^;]+)/);
    if(labelColorMatch && labelColorMatch[1].trim().startsWith('#')) labelColorPicker.value = labelColorMatch[1].trim();
    const labelFocusMatch = txt.match(/\.floating-input:focus\s*~\s*\.floating-label[^{]*\{\s*[^}]*color:\s*([^;]+)/);
    if(labelFocusMatch && labelFocusMatch[1].trim().startsWith('#')) labelFocusColorPicker.value = labelFocusMatch[1].trim();
    const labelTextMatch = txt.match(/<label[^>]*>([^<]+)<\/label>/);
    if(labelTextMatch) labelTextInput.value = labelTextMatch[1].trim();
    applyDesign();
    setTimeout(() => { isUpdatingFromCode = false; updateSyncStatus('synced from code'); }, 30);
}

function exportCodeFile() {
    const code = codeEditor.value;
    let ext = 'txt';
    if(currentPlatform === 'web') ext = 'html';
    else if(currentPlatform === 'react') ext = 'tsx';
    else if(currentPlatform === 'android') ext = 'xml';
    else if(currentPlatform === 'tkinter') ext = 'py';
    const blob = new Blob([code], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `floating_label_input.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
    updateSyncStatus('file exported');
}

async function exportPNG() {
    const container = document.querySelector('.input-preview-container');
    if(!container) return;
    try {
        const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = `floating_label_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        updateSyncStatus('PNG saved');
    } catch(e) { alert('PNG export ready'); updateSyncStatus('ready'); }
}

// ========== CLEAN COPY BUTTON: ONLY TEXT CHANGE, NO COLOR/ANIMATION EFFECTS ==========
async function copyCodeClean() {
    const code = codeEditor.value;
    if (!code) return;
    await navigator.clipboard.writeText(code);
    
    // Save original text
    const originalText = copyBtn.textContent;
    // Change text only, no style modifications
    copyBtn.textContent = '✓ Copied!';
    updateSyncStatus('Code copied to clipboard!');
    
    // Revert text after delay, but keep original styling untouched
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 1500);
}

const allDesignEvt = [
    borderColorPicker, gradientStartPicker, gradientEndPicker, 
    labelColorPicker, labelFocusColorPicker, textColorPicker, 
    bgColorPicker, inputTypeSelect, inputWidthSlider, 
    fontSizeSelect, labelTextInput, placeholderTextInput, tkPaddingSlider
];
allDesignEvt.forEach(el => el.addEventListener('input', applyDesign));
allDesignEvt.forEach(el => el.addEventListener('change', applyDesign));

syncBtn.addEventListener('click', syncDesignFromCode);
// Use clean copy handler (only text change, no background/color animations)
copyBtn.addEventListener('click', copyCodeClean);
exportCodeBtn.addEventListener('click', exportCodeFile);
exportImageBtn.addEventListener('click', exportPNG);

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPlatform = btn.getAttribute('data-platform');
        updateCodeForPlatform();
        updateSyncStatus(`switched to ${currentPlatform}`);
    });
});

applyDesign();
updateCodeForPlatform();
})();