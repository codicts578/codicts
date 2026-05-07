(function() {
    // DOM elements
    const gradientColor1Picker = document.getElementById('gradientColor1');
    const gradientColor2Picker = document.getElementById('gradientColor2');
    const cardBgColorPicker = document.getElementById('cardBgColor');
    const glowIntensitySelect = document.getElementById('glowIntensity');
    const btnRadiusSelect = document.getElementById('btnRadius');
    const formCanvas = document.getElementById('formCanvas');
    const codeEditor = document.getElementById('codeEditor');
    const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    
    // Neon Form HTML Structure
    function getNeonFormHTML() {
        return `
            <div class="neon-form-wrapper">
                <div class="form-card" id="formCard">
                    <div class="form-card-inner">
                        <form class="neon-form" id="neonForm">
                            <p id="formHeading">Login</p>
                            <div class="neon-field">
                                <svg viewBox="0 0 16 16" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" class="input-icon">
                                    <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
                                </svg>
                                <input type="text" class="neon-input" placeholder="Username" autocomplete="off" id="neonUsername" value="demo_user" />
                            </div>
                            <div class="neon-field">
                                <svg viewBox="0 0 16 16" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" class="input-icon">
                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                                </svg>
                                <input type="password" class="neon-input" placeholder="Password" id="neonPassword" value="demo123" />
                            </div>
                            <div class="btn-group">
                                <button type="submit" class="login-btn">Login</button>
                                <button type="button" class="signup-btn">Sign Up</button>
                            </div>
                            <button type="button" class="forgot-btn">Forgot Password</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Apply customizations to the form
    function applyFormDesign() {
        const gradient1 = gradientColor1Picker.value;
        const gradient2 = gradientColor2Picker.value;
        const cardBg = cardBgColorPicker.value;
        const glowIntensity = glowIntensitySelect.value;
        const btnRadius = btnRadiusSelect.value;
        
        // Update CSS variables dynamically
        const styleTag = document.getElementById('dynamic-neon-styles') || (() => {
            const style = document.createElement('style');
            style.id = 'dynamic-neon-styles';
            document.head.appendChild(style);
            return style;
        })();
        
        styleTag.innerHTML = `
            .form-card {
                background-image: linear-gradient(163deg, ${gradient1} 0%, ${gradient2} 100%) !important;
                box-shadow: 0px 0px 30px ${parseFloat(glowIntensity) * 40}px rgba(0, 255, 117, ${glowIntensity}) !important;
            }
            .neon-form {
                background-color: ${cardBg} !important;
            }
            .neon-field {
                background-color: ${cardBg} !important;
                box-shadow: inset 2px 5px 10px rgb(5, 5, 5) !important;
            }
            .login-btn, .signup-btn, .forgot-btn {
                border-radius: ${btnRadius} !important;
            }
            .login-btn:hover, .signup-btn:hover {
                background-color: black !important;
            }
            .forgot-btn:hover {
                background-color: red !important;
            }
        `;
        
        updateCodeForPlatform();
    }
    
    function updateSyncStatus(msg, isError = false) {
        syncStatusSpan.textContent = isError ? `⚠️ ${msg}` : `✓ ${msg}`;
        syncStatusSpan.style.color = isError ? '#f97316' : '#10b981';
        setTimeout(() => { 
            if(syncStatusSpan.textContent.includes(msg)) {
                syncStatusSpan.textContent = '✓ live sync';
                syncStatusSpan.style.color = '#10b981';
            }
        }, 2000);
    }
    
    function escapeHtml(str) { 
        return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); 
    }
    
    // Generate Web Code
    function generateWebCode() {
        const gradient1 = gradientColor1Picker.value;
        const gradient2 = gradientColor2Picker.value;
        const cardBg = cardBgColorPicker.value;
        const glowIntensity = glowIntensitySelect.value;
        const btnRadius = btnRadiusSelect.value;
        
        return `<!-- Neon Login Form (Dark Neon Style) -->
<div class="neon-form-wrapper">
<div class="form-card">
<div class="form-card-inner">
<form class="neon-form" id="neonLoginForm">
<p id="formHeading">Login</p>
<div class="neon-field">
    <svg viewBox="0 0 16 16" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" class="input-icon">
    <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
    </svg>
    <input type="text" class="neon-input" placeholder="Username" autocomplete="off" />
</div>
<div class="neon-field">
    <svg viewBox="0 0 16 16" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" class="input-icon">
    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
    </svg>
    <input type="password" class="neon-input" placeholder="Password" />
</div>
<div class="btn-group">
    <button type="submit" class="login-btn">Login</button>
    <button type="button" class="signup-btn">Sign Up</button>
</div>
<button type="button" class="forgot-btn">Forgot Password</button>
</form>
</div>
</div>
</div>

<style>
.neon-form-wrapper {
display: flex;
justify-content: center;
align-items: center;
font-family: 'Inter', system-ui, sans-serif;
background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
min-height: 100vh;
}
.form-card {
background-image: linear-gradient(163deg, ${gradient1} 0%, ${gradient2} 100%);
border-radius: 22px;
width: 24em;
transition: all 0.3s;
box-shadow: 0px 0px 30px ${parseFloat(glowIntensity) * 40}px rgba(0, 255, 117, ${glowIntensity});
}
.form-card-inner {
border-radius: 0;
transition: all 0.2s;
}
.form-card-inner:hover {
transform: scale(0.98);
border-radius: 20px;
}
.neon-form {
display: flex;
flex-direction: column;
gap: 10px;
width: 20em;
padding-left: 2em;
padding-right: 2em;
padding-bottom: 0.4em;
background-color: ${cardBg};
border-radius: 25px;
transition: 0.4s ease-in-out;
}
#formHeading {
text-align: center;
margin: 2em;
color: rgb(255, 255, 255);
font-size: 1.2em;
font-weight: 600;
}
.neon-field {
display: flex;
align-items: center;
justify-content: center;
gap: 0.5em;
border-radius: 25px;
padding: 0.6em;
border: none;
outline: none;
color: white;
background-color: ${cardBg};
box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
}
.input-icon {
height: 1.3em;
width: 1.3em;
fill: white;
}
.neon-input {
background: none;
border: none;
outline: none;
width: 100%;
color: #d3d3d3;
font-family: inherit;
font-size: 0.9rem;
}
.neon-input::placeholder {
color: #666;
}
.btn-group {
display: flex;
justify-content: center;
flex-direction: row;
margin-top: 2.5em;
gap: 0.5em;
}
.login-btn, .signup-btn, .forgot-btn {
padding: 0.5em;
border-radius: ${btnRadius};
border: none;
outline: none;
transition: 0.4s ease-in-out;
background-color: #252525;
color: white;
cursor: pointer;
font-family: inherit;
font-weight: 500;
}
.login-btn {
padding-left: 1.1em;
padding-right: 1.1em;
}
.signup-btn {
padding-left: 2.3em;
padding-right: 2.3em;
}
.forgot-btn {
margin-bottom: 3em;
margin-top: 1em;
}
.login-btn:hover, .signup-btn:hover {
background-color: black;
color: white;
transform: translateY(-2px);
}
.forgot-btn:hover {
background-color: red;
color: white;
transform: translateY(-2px);
}
</style>

<script>
document.getElementById('neonLoginForm')?.addEventListener('submit', (e) => {
e.preventDefault();
alert('Welcome! Login successful.');
});
<\/script>`;
    }
    
    function generateReactCode() {
        const gradient1 = gradientColor1Picker.value;
        const gradient2 = gradientColor2Picker.value;
        const cardBg = cardBgColorPicker.value;
        const glowIntensity = glowIntensitySelect.value;
        const btnRadius = btnRadiusSelect.value;
        
        return `// NeonLoginForm.tsx
import React, { useState } from 'react';

const NeonLoginForm: React.FC = () => {
const [formData, setFormData] = useState({ username: '', password: '' });

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
alert('Welcome! Login successful.');
};

const containerStyle: React.CSSProperties = {
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
fontFamily: "'Inter', system-ui, sans-serif",
background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
minHeight: '100vh'
};

const cardStyle: React.CSSProperties = {
backgroundImage: \`linear-gradient(163deg, ${gradient1} 0%, ${gradient2} 100%)\`,
borderRadius: '22px',
width: '24em',
boxShadow: \`0px 0px 30px ${parseFloat(glowIntensity) * 40}px rgba(0, 255, 117, ${glowIntensity})\`
};

const formStyle: React.CSSProperties = {
display: 'flex',
flexDirection: 'column',
gap: '10px',
width: '20em',
padding: '0 2em 0.4em 2em',
backgroundColor: '${cardBg}',
borderRadius: '25px'
};

const fieldStyle: React.CSSProperties = {
display: 'flex',
alignItems: 'center',
gap: '0.5em',
borderRadius: '25px',
padding: '0.6em',
backgroundColor: '${cardBg}',
boxShadow: 'inset 2px 5px 10px rgb(5, 5, 5)'
};

const btnStyle: React.CSSProperties = {
padding: '0.5em',
borderRadius: '${btnRadius}',
backgroundColor: '#252525',
color: 'white',
cursor: 'pointer',
border: 'none'
};

return (
<div style={containerStyle}>
<div style={cardStyle}>
<div>
    <form onSubmit={handleSubmit} style={formStyle}>
    <p style={{ textAlign: 'center', margin: '2em', color: 'white', fontSize: '1.2em', fontWeight: 600 }}>Login</p>
    <div style={fieldStyle}>
        <input type="text" placeholder="Username" style={{ background: 'none', border: 'none', outline: 'none', width: '100%', color: '#d3d3d3' }} />
    </div>
    <div style={fieldStyle}>
        <input type="password" placeholder="Password" style={{ background: 'none', border: 'none', outline: 'none', width: '100%', color: '#d3d3d3' }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5em', marginTop: '2.5em' }}>
        <button type="submit" style={btnStyle}>Login</button>
        <button type="button" style={btnStyle}>Sign Up</button>
    </div>
    <button type="button" style={{ ...btnStyle, marginBottom: '3em', marginTop: '1em' }}>Forgot Password</button>
    </form>
</div>
</div>
</div>
);
};
export default NeonLoginForm;`;
    }
    
    function generateAndroidCode() {
        const gradient1 = gradientColor1Picker.value;
        const gradient2 = gradientColor2Picker.value;
        
        return `<!-- res/layout/activity_login.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
android:layout_width="match_parent"
android:layout_height="match_parent"
android:gravity="center"
android:background="linear-gradient(135deg, #0a0a0a, #1a1a2e)"
android:orientation="vertical">

<LinearLayout
android:layout_width="380dp"
android:layout_height="wrap_content"
android:orientation="vertical"
android:background="@drawable/gradient_border"
android:padding="24dp">

<TextView
    android:text="Login"
    android:textSize="24sp"
    android:textColor="#FFFFFF"
    android:gravity="center"
    android:layout_marginBottom="24dp"
    android:textStyle="bold"/>

<EditText
    android:hint="Username"
    android:inputType="textEmailAddress"
    android:background="@drawable/input_bg"
    android:padding="12dp"
    android:layout_marginBottom="16dp"/>

<EditText
    android:hint="Password"
    android:inputType="textPassword"
    android:background="@drawable/input_bg"
    android:padding="12dp"
    android:layout_marginBottom="24dp"/>

<Button
    android:text="Login"
    android:background="@drawable/neon_btn"
    android:textColor="#FFFFFF"
    android:padding="12dp"/>
</LinearLayout>
</LinearLayout>

<!-- drawable/gradient_border.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
<gradient
android:startColor="${gradient1}"
android:endColor="${gradient2}"
android:angle="135"/>
<corners android:radius="22dp"/>
</shape>`;
    }
    
    function generateTkinterCode() {
        const cardBg = cardBgColorPicker.value;
        const btnRadius = btnRadiusSelect.value;
        const btnRadiusPx = btnRadius === '5px' ? 5 : (btnRadius === '12px' ? 12 : 25);
        
        return `# Python Tkinter Neon Login Form
import tkinter as tk
from tkinter import messagebox

def attempt_login():
username = username_entry.get()
password = password_entry.get()
messagebox.showinfo("Login", f"Welcome {username}!")

root = tk.Tk()
root.title("Neon Login")
root.geometry("450x550")
root.configure(bg="#0a0a0a")

# Card frame
card = tk.Frame(root, bg="${cardBg}", relief="flat", bd=0)
card.pack(pady=30, padx=35, fill="both", expand=True)

# Title
tk.Label(card, text="Login", font=("Segoe UI", 24, "bold"), 
    fg="white", bg="${cardBg}").pack(pady=(30,20))

# Username field
username_frame = tk.Frame(card, bg="${cardBg}", relief="flat", bd=1)
username_frame.pack(fill="x", pady=10, padx=20)
username_entry = tk.Entry(username_frame, font=("Segoe UI", 11), 
                    bg="${cardBg}", fg="#d3d3d3", relief="flat", bd=0)
username_entry.pack(fill="x", padx=10, pady=10)
username_entry.insert(0, "Username")

# Password field  
password_frame = tk.Frame(card, bg="${cardBg}", relief="flat", bd=1)
password_frame.pack(fill="x", pady=10, padx=20)
password_entry = tk.Entry(password_frame, font=("Segoe UI", 11), 
                    bg="${cardBg}", fg="#d3d3d3", show="*", relief="flat", bd=0)
password_entry.pack(fill="x", padx=10, pady=10)
password_entry.insert(0, "password")

# Buttons
btn_frame = tk.Frame(card, bg="${cardBg}")
btn_frame.pack(pady=30)

login_btn = tk.Button(btn_frame, text="Login", font=("Segoe UI", 11, "bold"),
                bg="#252525", fg="white", relief="flat", cursor="hand2",
                command=attempt_login, padx=20, pady=8)
login_btn.pack(side="left", padx=5)

signup_btn = tk.Button(btn_frame, text="Sign Up", font=("Segoe UI", 11, "bold"),
                bg="#252525", fg="white", relief="flat", cursor="hand2",
                padx=20, pady=8)
signup_btn.pack(side="left", padx=5)

forgot_btn = tk.Button(card, text="Forgot Password", font=("Segoe UI", 10),
                bg="#252525", fg="white", relief="flat", cursor="hand2",
                padx=15, pady=6)
forgot_btn.pack(pady=10)

root.mainloop()`;
    }
    
    function updateCodeForPlatform() {
        let code = '';
        if(currentPlatform === 'web') code = generateWebCode();
        else if(currentPlatform === 'react') code = generateReactCode();
        else if(currentPlatform === 'android') code = generateAndroidCode();
        else if(currentPlatform === 'tkinter') code = generateTkinterCode();
        codeEditor.value = code;
    }
    
    // Copy with animation
    async function copyCodeWithAnimation() {
        const code = codeEditor.value;
        await navigator.clipboard.writeText(code);
        
        copyFinalCodeBtn.classList.add('copy-animation');
        const originalText = copyFinalCodeBtn.textContent;
        copyFinalCodeBtn.textContent = '✓ Copied!';
        updateSyncStatus('Code copied to clipboard!');
        
        setTimeout(() => {
            copyFinalCodeBtn.textContent = originalText;
            copyFinalCodeBtn.classList.remove('copy-animation');
        }, 1500);
    }
    
    function exportCodeFile() {
        const code = codeEditor.value;
        const ext = currentPlatform === 'web' ? 'html' : (currentPlatform === 'react' ? 'tsx' : (currentPlatform === 'android' ? 'xml' : 'py'));
        const blob = new Blob([code], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `neon_form.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        updateSyncStatus('File exported!');
    }
    
    async function exportFormAsPNG() {
        const node = document.querySelector('.neon-form-wrapper');
        if(!node) return;
        try {
            const html2canvasModule = await import('https://cdn.skypack.dev/html2canvas@1.4.1');
            const html2canvas = html2canvasModule.default;
            const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#0a0a0a' });
            const link = document.createElement('a');
            link.download = `neon_form_${Date.now()}.png`;
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
        formCanvas.innerHTML = getNeonFormHTML();
        applyFormDesign();
        
        // Handle form submission
        const form = document.getElementById('neonForm');
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Welcome! Login successful.');
            });
            
            // Handle signup button
            const signupBtn = form.querySelector('.signup-btn');
            if(signupBtn) {
                signupBtn.addEventListener('click', () => {
                    alert('Sign up feature coming soon!');
                });
            }
            
            // Handle forgot button
            const forgotBtn = form.querySelector('.forgot-btn');
            if(forgotBtn) {
                forgotBtn.addEventListener('click', () => {
                    alert('Password reset link sent to your email!');
                });
            }
        }
    }
    
    // Event listeners
    gradientColor1Picker.addEventListener('input', applyFormDesign);
    gradientColor2Picker.addEventListener('input', applyFormDesign);
    cardBgColorPicker.addEventListener('input', applyFormDesign);
    glowIntensitySelect.addEventListener('change', applyFormDesign);
    btnRadiusSelect.addEventListener('change', applyFormDesign);
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