(function() {
    // DOM elements
    const primaryColorPicker = document.getElementById('primaryColor');
    const secondaryColorPicker = document.getElementById('secondaryColor');
    const bgColorPicker = document.getElementById('bgColor');
    const glitchDurationSelect = document.getElementById('glitchDuration');
    const formCanvas = document.getElementById('formCanvas');
    const codeEditor = document.getElementById('codeEditor');
    const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    
    // Glitch Form HTML Structure
    function getGlitchFormHTML() {
        return `
            <div class="glitch-form-wrapper">
                <form class="glitch-card" id="glitchForm">
                    <div class="card-header">
                        <div class="card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                <path d="M12 11.5a3 3 0 0 0 -3 2.824v1.176a3 3 0 0 0 6 0v-1.176a3 3 0 0 0 -3 -2.824z"></path>
                            </svg>
                            <span>SECURE_DATA</span>
                        </div>
                        <div class="card-dots"><span></span><span></span><span></span></div>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <input type="text" id="username" name="username" required="" placeholder="" />
                            <label for="username" class="form-label" data-text="USERNAME">USERNAME</label>
                        </div>
                        <div class="form-group">
                            <input type="password" id="password" name="password" required="" placeholder="" />
                            <label for="password" class="form-label" data-text="ACCESS_KEY">ACCESS_KEY</label>
                        </div>
                        <button data-text="INITIATE_CONNECTION" type="submit" class="submit-btn">
                            <span class="btn-text">INITIATE_CONNECTION</span>
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
    
    // Apply customizations to the form
    function applyFormDesign() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const bgColor = bgColorPicker.value;
        const glitchDuration = glitchDurationSelect.value;
        
        // Update CSS variables dynamically
        const styleTag = document.getElementById('dynamic-glitch-styles') || (() => {
            const style = document.createElement('style');
            style.id = 'dynamic-glitch-styles';
            document.head.appendChild(style);
            return style;
        })();
        
        styleTag.innerHTML = `
            .glitch-card {
                background-color: ${bgColor} !important;
                border-color: ${primary}33 !important;
                box-shadow: 0 0 20px ${primary}1a, inset 0 0 10px rgba(0,0,0,0.5) !important;
            }
            .card-header {
                border-bottom-color: ${primary}33 !important;
            }
            .card-title, .card-title svg {
                color: ${primary} !important;
                stroke: ${primary} !important;
            }
            .form-label {
                color: ${primary} !important;
            }
            .form-group input {
                border-bottom-color: ${primary}4d !important;
                color: #e5e5e5 !important;
            }
            .form-group input:focus {
                border-color: ${primary} !important;
            }
            .submit-btn {
                border-color: ${primary} !important;
                color: ${primary} !important;
            }
            .submit-btn:hover, .submit-btn:focus {
                background-color: ${primary} !important;
                color: ${bgColor} !important;
                box-shadow: 0 0 25px ${primary} !important;
            }
            .submit-btn::before, .submit-btn::after {
                background-color: ${primary} !important;
            }
            .submit-btn:hover::before, .submit-btn:focus::before {
                color: ${secondary} !important;
                animation-duration: ${glitchDuration} !important;
            }
            .submit-btn:hover::after, .submit-btn:focus::after {
                color: ${bgColor} !important;
                animation-duration: ${glitchDuration} !important;
            }
            .form-group input:focus + .form-label::before,
            .form-group input:focus + .form-label::after {
                animation-duration: ${glitchDuration} !important;
            }
            .form-group input:focus + .form-label::before {
                color: ${secondary} !important;
            }
            .form-group input:focus + .form-label::after {
                color: ${primary} !important;
            }
        `;
        
        updateCodeForPlatform();
    }
    
    function updateSyncStatus(msg, isError = false) {
        syncStatusSpan.textContent = isError ? `⚠️ ${msg}` : `✓ ${msg}`;
        syncStatusSpan.style.color = isError ? '#f97316' : '#10b981';
        setTimeout(() => { 
            if(syncStatusSpan.textContent.includes(msg)) {
                syncStatusSpan.textContent = '✓ ready';
                syncStatusSpan.style.color = '#10b981';
            }
        }, 2000);
    }
    
    function escapeHtml(str) { 
        return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); 
    }
    
    // Generate Web Code
    function generateWebCode() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const bgColor = bgColorPicker.value;
        const glitchDuration = glitchDurationSelect.value;
        
        return `<!-- Glitch/Cyberpunk Login Form -->
<div class="glitch-form-wrapper">
<form class="glitch-card">
<div class="card-header">
<div class="card-title">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
    <path d="M12 11.5a3 3 0 0 0 -3 2.824v1.176a3 3 0 0 0 6 0v-1.176a3 3 0 0 0 -3 -2.824z"></path>
</svg>
<span>SECURE_DATA</span>
</div>
<div class="card-dots"><span></span><span></span><span></span></div>
</div>
<div class="card-body">
<div class="form-group">
<input type="text" id="username" name="username" required="" placeholder="" />
<label for="username" class="form-label" data-text="USERNAME">USERNAME</label>
</div>
<div class="form-group">
<input type="password" id="password" name="password" required="" placeholder="" />
<label for="password" class="form-label" data-text="ACCESS_KEY">ACCESS_KEY</label>
</div>
<button data-text="INITIATE_CONNECTION" type="submit" class="submit-btn">
<span class="btn-text">INITIATE_CONNECTION</span>
</button>
</div>
</form>
</div>

<style>
.glitch-form-wrapper {
display: flex;
justify-content: center;
align-items: center;
font-family: 'Fira Code', Consolas, 'Courier New', Courier, monospace;
background-color: #050505;
min-height: 100vh;
}
.glitch-card {
background-color: ${bgColor};
width: 100%;
max-width: 380px;
border: 1px solid ${primary}33;
box-shadow: 0 0 20px ${primary}1a, inset 0 0 10px rgba(0,0,0,0.5);
overflow: hidden;
}
.card-header {
display: flex;
justify-content: space-between;
align-items: center;
background-color: rgba(0,0,0,0.3);
padding: 0.5em 1em;
border-bottom: 1px solid ${primary}33;
}
.card-title {
color: ${primary};
font-size: 0.8rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.1em;
display: flex;
align-items: center;
gap: 0.5em;
}
.card-title svg {
width: 1.2em;
height: 1.2em;
stroke: ${primary};
}
.card-dots span {
display: inline-block;
width: 8px;
height: 8px;
border-radius: 50%;
background-color: #333;
margin-left: 5px;
}
.card-body {
padding: 1.5rem;
}
.form-group {
position: relative;
margin-bottom: 1.5rem;
}
.form-label {
position: absolute;
top: 0.75em;
left: 0;
font-size: 1rem;
color: ${primary};
opacity: 0.6;
text-transform: uppercase;
letter-spacing: 0.1em;
pointer-events: none;
transition: all 0.3s ease;
}
.form-group input {
width: 100%;
background: transparent;
border: none;
border-bottom: 2px solid ${primary}4d;
padding: 0.75em 0;
font-size: 1rem;
color: #e5e5e5;
font-family: inherit;
outline: none;
transition: border-color 0.3s ease;
}
.form-group input:focus {
border-color: ${primary};
}
.form-group input:focus + .form-label,
.form-group input:not(:placeholder-shown) + .form-label {
top: -1.2em;
font-size: 0.8rem;
opacity: 1;
}
.submit-btn {
width: 100%;
padding: 0.8em;
margin-top: 1rem;
background-color: transparent;
border: 2px solid ${primary};
color: ${primary};
font-family: inherit;
font-size: 1rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.2em;
cursor: pointer;
position: relative;
transition: all 0.3s;
overflow: hidden;
}
.submit-btn:hover, .submit-btn:focus {
background-color: ${primary};
color: ${bgColor};
box-shadow: 0 0 25px ${primary};
outline: none;
}
.submit-btn:active {
transform: scale(0.97);
}
.submit-btn .btn-text {
position: relative;
z-index: 1;
transition: opacity 0.2s ease;
}
.submit-btn:hover .btn-text {
opacity: 0;
}
.submit-btn::before, .submit-btn::after {
content: attr(data-text);
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
display: flex;
align-items: center;
justify-content: center;
opacity: 0;
background-color: ${primary};
transition: opacity 0.2s ease;
}
.submit-btn:hover::before, .submit-btn:focus::before {
opacity: 1;
color: ${secondary};
animation: glitch-anim ${glitchDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.submit-btn:hover::after, .submit-btn:focus::after {
opacity: 1;
color: ${bgColor};
animation: glitch-anim ${glitchDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
}
@keyframes glitch-anim {
0% { transform: translate(0); clip-path: inset(0 0 0 0); }
20% { transform: translate(-5px, 3px); clip-path: inset(50% 0 20% 0); }
40% { transform: translate(3px, -2px); clip-path: inset(20% 0 60% 0); }
60% { transform: translate(-4px, 2px); clip-path: inset(80% 0 5% 0); }
80% { transform: translate(4px, -3px); clip-path: inset(30% 0 45% 0); }
100% { transform: translate(0); clip-path: inset(0 0 0 0); }
}
</style>

<script>
document.querySelector('.submit-btn')?.addEventListener('click', (e) => {
e.preventDefault();
alert('🔐 INITIATING SECURE CONNECTION...');
});
<\/script>`;
    }
    
    function generateReactCode() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const bgColor = bgColorPicker.value;
        const glitchDuration = glitchDurationSelect.value;
        
        return `// GlitchLoginForm.tsx
import React, { useState } from 'react';

const GlitchLoginForm: React.FC = () => {
const [formData, setFormData] = useState({ username: '', password: '' });

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
alert('🔐 INITIATING SECURE CONNECTION...');
};

const containerStyle: React.CSSProperties = {
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
fontFamily: "'Fira Code', Consolas, monospace",
background: '#050505',
minHeight: '100vh'
};

const cardStyle: React.CSSProperties = {
backgroundColor: '${bgColor}',
width: '100%',
maxWidth: '380px',
border: '1px solid ${primary}33',
boxShadow: '0 0 20px ${primary}1a',
overflow: 'hidden'
};

const titleStyle: React.CSSProperties = {
color: '${primary}',
fontSize: '0.8rem',
fontWeight: 700,
textTransform: 'uppercase',
letterSpacing: '0.1em',
display: 'flex',
alignItems: 'center',
gap: '0.5em'
};

const btnStyle: React.CSSProperties = {
width: '100%',
padding: '0.8em',
marginTop: '1rem',
background: 'transparent',
border: '2px solid ${primary}',
color: '${primary}',
fontFamily: 'inherit',
fontSize: '1rem',
fontWeight: 700,
textTransform: 'uppercase',
letterSpacing: '0.2em',
cursor: 'pointer',
position: 'relative',
overflow: 'hidden'
};

return (
<div style={containerStyle}>
<form onSubmit={handleSubmit} style={cardStyle}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5em 1em', borderBottom: '1px solid ${primary}33', background: 'rgba(0,0,0,0.3)' }}>
    <div style={titleStyle}>
    <svg width="20" height="20" viewBox="0 0 24 24" stroke="${primary}" fill="none">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M17 21h-10a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
    <span>SECURE_DATA</span>
    </div>
</div>
<div style={{ padding: '1.5rem' }}>
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
    <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid ${primary}4d', padding: '0.75em 0', color: '#e5e5e5', outline: 'none' }} />
    <label style={{ position: 'absolute', top: '0.75em', left: 0, color: '${primary}', opacity: 0.6, transition: 'all 0.3s ease' }}>USERNAME</label>
    </div>
    <button type="submit" style={btnStyle}>INITIATE_CONNECTION</button>
</div>
</form>
</div>
);
};
export default GlitchLoginForm;`;
    }
    
    function generateVueCode() {
        const primary = primaryColorPicker.value;
        const bgColor = bgColorPicker.value;
        
        return `<!-- GlitchLoginForm.vue -->
<template>
<div class="glitch-wrapper">
<form class="glitch-card" @submit.prevent="handleSubmit">
<div class="card-header">
<div class="card-title">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke-width="1.5"/>
    <path d="M17 21h-10a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke-width="1.5"/>
    </svg>
    <span>SECURE_DATA</span>
</div>
</div>
<div class="card-body">
<div class="form-group">
    <input type="text" v-model="username" required />
    <label>USERNAME</label>
</div>
<button type="submit" class="submit-btn">INITIATE_CONNECTION</button>
</div>
</form>
</div>
</template>

<script setup>
import { ref } from 'vue'
const username = ref('')
const handleSubmit = () => alert('🔐 Login submitted!')
<\/script>

<style scoped>
.glitch-wrapper {
display: flex;
justify-content: center;
align-items: center;
background: #050505;
min-height: 100vh;
}
.glitch-card {
background: ${bgColor};
max-width: 380px;
border: 1px solid ${primary}33;
}
.submit-btn {
background: transparent;
border: 2px solid ${primary};
color: ${primary};
padding: 0.8em;
width: 100%;
cursor: pointer;
}
.submit-btn:hover {
background: ${primary};
color: ${bgColor};
}
</style>`;
    }
    
    function updateCodeForPlatform() {
        let code = '';
        if(currentPlatform === 'web') code = generateWebCode();
        else if(currentPlatform === 'react') code = generateReactCode();
        else if(currentPlatform === 'vue') code = generateVueCode();
        codeEditor.value = code;
    }
    
    // Copy with animation
    async function copyCodeWithAnimation() {
        const code = codeEditor.value;
        await navigator.clipboard.writeText(code);
        
        // Add animation to button
        copyFinalCodeBtn.classList.add('copy-animation');
        const originalText = copyFinalCodeBtn.textContent;
        copyFinalCodeBtn.textContent = '✅ Copied!';
        updateSyncStatus('Code copied to clipboard!');
        
        setTimeout(() => {
            copyFinalCodeBtn.textContent = originalText;
            copyFinalCodeBtn.classList.remove('copy-animation');
        }, 1500);
    }
    
    function exportCodeFile() {
        const code = codeEditor.value;
        const ext = currentPlatform === 'web' ? 'html' : (currentPlatform === 'react' ? 'tsx' : 'vue');
        const blob = new Blob([code], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `glitch_form.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        updateSyncStatus('File exported!');
    }
    
    async function exportFormAsPNG() {
        const node = document.querySelector('.glitch-form-wrapper');
        if(!node) return;
        try {
            const html2canvasModule = await import('https://cdn.skypack.dev/html2canvas@1.4.1');
            const html2canvas = html2canvasModule.default;
            const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#050505' });
            const link = document.createElement('a');
            link.download = `glitch_form_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            updateSyncStatus('PNG saved!');
        } catch(e) {
            updateSyncStatus('HTML2Canvas error', true);
            alert('Please try again or check console');
        }
    }
    
    // Initialize form
    function init() {
        formCanvas.innerHTML = getGlitchFormHTML();
        applyFormDesign();
        
        // Handle form submission
        const form = document.getElementById('glitchForm');
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('🔐 INITIATING SECURE CONNECTION...\nWelcome to the system!');
            });
        }
    }
    
    // Event listeners
    primaryColorPicker.addEventListener('input', applyFormDesign);
    secondaryColorPicker.addEventListener('input', applyFormDesign);
    bgColorPicker.addEventListener('input', applyFormDesign);
    glitchDurationSelect.addEventListener('change', applyFormDesign);
    copyFinalCodeBtn.addEventListener('click', copyCodeWithAnimation);
    exportCodeBtn.addEventListener('click', exportCodeFile);
    exportImageBtn.addEventListener('click', exportFormAsPNG);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.getAttribute('data-platform');
            updateCodeForPlatform();
        });
    });
    
    init();
    updateCodeForPlatform();
})();