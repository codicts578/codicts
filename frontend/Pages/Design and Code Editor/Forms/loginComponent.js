(function() {
    // DOM elements
    const primaryColorPicker = document.getElementById('primaryColor');
    const formTextColorPicker = document.getElementById('formTextColor');
    const btnRadiusSelect = document.getElementById('btnRadius');
    const cardRadiusSelect = document.getElementById('cardRadius');
    const inputRadiusSelect = document.getElementById('inputRadius');
    const hoverEffectSelect = document.getElementById('hoverBtnEffect');
    const rememberToggle = document.getElementById('rememberToggle');
    
    // live form fields
    const liveUsernameEmail = document.getElementById('liveUsernameEmail');
    const livePassword = document.getElementById('livePassword');
    const loginBtnEl = document.getElementById('liveLoginBtn');
    const formTitleEl = document.getElementById('formTitle');
    const formSubEl = document.getElementById('formSubtext');
    const liveInputs = document.querySelectorAll('.live-input');
    const formContainer = document.querySelector('.form-preview-container');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const forgotLink = document.querySelector('.form-group a');
    const rememberGroup = document.querySelector('.form-group:has(#rememberCheckbox)');
    
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
            primary: primaryColorPicker.value,
            textColor: formTextColorPicker.value,
            btnRadius: btnRadiusSelect.value,
            cardRadius: cardRadiusSelect.value,
            inputRadius: inputRadiusSelect.value,
            hover: hoverEffectSelect.value,
            username: liveUsernameEmail.value,
            password: livePassword.value,
            rememberVisible: rememberToggle.value === 'show',
            rememberChecked: rememberCheckbox.checked
        };
    }
    
    function updateRememberVisibility() {
        const state = getDesignState();
        if (rememberGroup) {
            rememberGroup.style.display = state.rememberVisible ? 'flex' : 'none';
        }
    }
    
    function applyFormDesign() {
        if (isUpdatingFromCode) return;
        const state = getDesignState();
        loginBtnEl.style.backgroundColor = state.primary;
        loginBtnEl.style.color = '#fff';
        loginBtnEl.style.borderRadius = state.btnRadius;
        formTitleEl.style.color = state.textColor;
        formSubEl.style.color = '#475569';
        liveInputs.forEach(inp => {
            inp.style.borderColor = '#e2e8f0';
            inp.style.borderRadius = state.inputRadius;
            inp.style.color = state.textColor;
        });
        if (forgotLink) forgotLink.style.color = state.primary;
        formContainer.style.borderRadius = state.cardRadius;
        formContainer.style.backgroundColor = 'white';
        
        let hoverStyles = '';
        switch(state.hover) {
            case 'lift': hoverStyles = 'transform: translateY(-3px); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.2);'; break;
            case 'scale': hoverStyles = 'transform: scale(1.02);'; break;
            case 'darken': hoverStyles = `filter: brightness(0.92);`; break;
            case 'glow': hoverStyles = `box-shadow: 0 0 12px ${state.primary};`; break;
            default: hoverStyles = '';
        }
        let styleTag = document.getElementById('form-hover-style');
        if(!styleTag) { styleTag = document.createElement('style'); styleTag.id = 'form-hover-style'; document.head.appendChild(styleTag); }
        styleTag.innerHTML = `.login-submit-btn:hover { ${hoverStyles} transition: all 0.2s ease; }`;
        
        updateRememberVisibility();
        updateCodeForPlatform();
    }
    
    function updateSyncStatus(msg) {
        syncStatusSpan.textContent = `✓ ${msg}`;
        setTimeout(() => { if(syncStatusSpan.textContent.includes(msg)) syncStatusSpan.textContent = '✓ live sync'; }, 1500);
    }
    
    function escapeHtml(str) { return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }
    function escapeXml(str) { return str.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[m]); }
    
    // ========= CODE GENERATORS =========
    function generateWebCode() {
        const s = getDesignState();
        const hoverCss = (() => {
            switch(s.hover) {
                case 'lift': return 'transform: translateY(-3px); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.2);';
                case 'scale': return 'transform: scale(1.02);';
                case 'darken': return 'filter: brightness(0.92);';
                case 'glow': return `box-shadow: 0 0 12px ${s.primary};`;
                default: return '';
            }
        })();
        const rememberHtml = s.rememberVisible ? `<div style="display: flex; justify-content: space-between; margin-bottom: 1.2rem;">
            <label style="display: flex; align-items: center; gap: 6px;"><input type="checkbox" ${s.rememberChecked ? 'checked' : ''}> Remember me</label>
            <a href="#" style="color: ${s.primary}; text-decoration: none; font-size:0.8rem;">Forgot password?</a>
        </div>` : '';
        return `<!-- Login Form Component (Web) -->
<form class="login-form" id="loginForm">
<h3 style="color:${s.textColor}">Welcome back</h3>
<p style="color:#475569">Sign in to your account</p>
<div class="input-group"><input type="text" placeholder="Email / Username" value="${escapeHtml(s.username)}" /></div>
<div class="input-group"><input type="password" placeholder="Password" value="${escapeHtml(s.password)}" /></div>
${rememberHtml}
<button type="submit">Log In →</button>
</form>

<style>
.login-form {
background: white;
border-radius: ${s.cardRadius};
padding: 2rem;
max-width: 400px;
margin: auto;
box-shadow: 0 20px 35px rgba(0,0,0,0.1);
}
.input-group input {
width: 100%;
padding: 12px 16px;
margin-bottom: 1rem;
border: 1.5px solid #e2e8f0;
border-radius: ${s.inputRadius};
font-size: 0.9rem;
}
.login-form button {
width: 100%;
background: ${s.primary};
color: white;
border: none;
border-radius: ${s.btnRadius};
padding: 12px;
font-weight: bold;
cursor: pointer;
transition: all 0.2s;
}
.login-form button:hover {
${hoverCss}
}
</style>
<script>
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
e.preventDefault();
alert('Login attempt (demo) - Welcome!');
});
<\/script>`;
    }
    
    function generateReactCode() {
        const s = getDesignState();
        const rememberBlock = s.rememberVisible ? `
<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem'}}>
<label><input type="checkbox" defaultChecked={${s.rememberChecked}} /> Remember me</label>
<a href="#" style={{color: '${s.primary}'}}>Forgot password?</a>
</div>` : '';
        return `// LoginForm.tsx (React + TypeScript)
import React, { useState } from 'react';
const LoginForm: React.FC = () => {
const [credentials, setCredentials] = useState({ username: '${escapeHtml(s.username)}', password: '${escapeHtml(s.password)}' });
const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert('Login submitted'); };
const containerStyle = { background: 'white', borderRadius: '${s.cardRadius}', padding: '2rem', maxWidth: 400, margin: 'auto', boxShadow: '0 20px 35px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '12px 16px', marginBottom: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '${s.inputRadius}' };
const btnStyle = { background: '${s.primary}', color: 'white', border: 'none', borderRadius: '${s.btnRadius}', padding: '12px', fontWeight: 'bold', cursor: 'pointer' };
return (
<form onSubmit={handleSubmit} style={containerStyle}>
<h3 style={{color:'${s.textColor}'}}>Welcome back</h3><p>Sign in</p>
<input style={inputStyle} placeholder="Email/Username" value={credentials.username} onChange={e=>setCredentials({...credentials,username:e.target.value})} />
<input style={inputStyle} type="password" placeholder="Password" value={credentials.password} onChange={e=>setCredentials({...credentials,password:e.target.value})} />
${rememberBlock}
<button style={btnStyle} type="submit">Log In →</button>
</form>
);
};
export default LoginForm;`;
    }
    
    function generateAndroidCode() {
        const s = getDesignState();
        const btnRadiusDp = s.btnRadius === '40px' ? '40' : (s.btnRadius === '16px' ? '16' : '24');
        const inputRadiusDp = s.inputRadius === '16px' ? '16' : '12';
        return `<!-- res/layout/activity_login.xml -->
<LinearLayout android:orientation="vertical" android:layout_width="match_parent" android:layout_height="match_parent" android:gravity="center" android:padding="24dp" android:background="#f1f5f9">
<LinearLayout android:orientation="vertical" android:layout_width="match_parent" android:layout_height="wrap_content" android:background="@drawable/card_bg" android:padding="24dp">
<TextView android:text="Welcome back" android:textSize="24sp" android:textColor="${s.textColor}" android:textStyle="bold"/>
<EditText android:hint="Email/Username" android:inputType="textEmailAddress" android:background="@drawable/input_bg" android:padding="12dp" android:layout_marginTop="16dp"/>
<EditText android:hint="Password" android:inputType="textPassword" android:background="@drawable/input_bg" android:padding="12dp"/>
<Button android:text="Log In" android:background="@drawable/primary_btn" android:textColor="white" android:padding="12dp"/>
</LinearLayout>
</LinearLayout>
<!-- drawable/primary_btn.xml -->
<shape><solid android:color="${s.primary}" /><corners android:radius="${btnRadiusDp}dp" /></shape>`;
    }
    
    function generateTkinterCode() {
        const s = getDesignState();
        return `# Python Tkinter Login Form
import tkinter as tk
from tkinter import messagebox

def attempt_login():
username = username_entry.get()
password = password_entry.get()
messagebox.showinfo("Login", f"Welcome {username}!")

root = tk.Tk()
root.title("Login")
root.geometry("400x480")
root.configure(bg="#f1f5f9")

card = tk.Frame(root, bg="white", relief="flat")
card.pack(pady=30, padx=20, fill="both", expand=True)

tk.Label(card, text="Welcome back", font=("Segoe UI", 20, "bold"), fg="${s.textColor}", bg="white").pack(pady=(20,5))
tk.Label(card, text="Sign in", fg="#475569", bg="white").pack()

username_entry = tk.Entry(card, font=("Segoe UI", 11), relief="flat", bd=1)
username_entry.pack(fill="x", pady=8, padx=20)
password_entry = tk.Entry(card, font=("Segoe UI", 11), show="*", relief="flat", bd=1)
password_entry.pack(fill="x", pady=8, padx=20)

btn = tk.Button(card, text="Log In →", bg="${s.primary}", fg="white", font=("Segoe UI", 11, "bold"),
        relief="flat", cursor="hand2", command=attempt_login)
btn.pack(pady=20, padx=20, fill="x")
root.mainloop()`;
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
            setTimeout(()=> updateSyncStatus('live sync'), 1500);
            return;
        }
        isUpdatingFromCode = true;
        const txt = codeEditor.value;
        const primaryMatch = txt.match(/background:\s*(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})/);
        if(primaryMatch) primaryColorPicker.value = primaryMatch[1];
        const colorMatch = txt.match(/h3[^>]*style="color:\s*([^;"]+)/);
        if(colorMatch) formTextColorPicker.value = colorMatch[1];
        const btnRadiusMatch = txt.match(/border-radius:\s*([^;]+);/);
        if(btnRadiusMatch) { let val = btnRadiusMatch[1].trim(); if(['8px','40px','16px','30px'].includes(val)) btnRadiusSelect.value = val; }
        const inputRad = txt.match(/\.input-group input[^}]*border-radius:\s*([^;]+)/);
        if(inputRad) { let val = inputRad[1].trim(); if(['8px','16px','30px'].includes(val)) inputRadiusSelect.value = val; }
        applyFormDesign();
        setTimeout(()=> { isUpdatingFromCode = false; updateSyncStatus('code → design'); }, 30);
    }
    
    function exportCodeFile() {
        const code = codeEditor.value;
        let ext = currentPlatform === 'web' ? 'html' : (currentPlatform === 'react' ? 'tsx' : (currentPlatform === 'android' ? 'xml' : 'py'));
        const blob = new Blob([code], {type:'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `login_form.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        updateSyncStatus('exported');
    }
    
    async function exportFormAsPNG() {
        const node = document.querySelector('.form-preview-container');
        if(!node) return;
        try {
            const html2canvasModule = await import('https://cdn.skypack.dev/html2canvas@1.4.1');
            const html2canvas = html2canvasModule.default;
            const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#f1f5f9' });
            const link = document.createElement('a');
            link.download = `login_form_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            updateSyncStatus('PNG saved');
        } catch(e) {
            alert('HTML2Canvas not loaded, using fallback');
            updateSyncStatus('error');
        }
    }
    
    // Event listeners
    primaryColorPicker.addEventListener('input', applyFormDesign);
    formTextColorPicker.addEventListener('input', applyFormDesign);
    btnRadiusSelect.addEventListener('change', applyFormDesign);
    cardRadiusSelect.addEventListener('change', applyFormDesign);
    inputRadiusSelect.addEventListener('change', applyFormDesign);
    hoverEffectSelect.addEventListener('change', applyFormDesign);
    rememberToggle.addEventListener('change', applyFormDesign);
    liveUsernameEmail.addEventListener('input', applyFormDesign);
    livePassword.addEventListener('input', applyFormDesign);
    rememberCheckbox.addEventListener('change', applyFormDesign);
    loginBtnEl.addEventListener('click', (e) => { e.preventDefault(); alert('🔐 Login preview | Authentication demo'); });
    syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
    copyFinalCodeBtn.addEventListener('click', async () => { await navigator.clipboard.writeText(codeEditor.value); copyFinalCodeBtn.innerText='✅ Copied!'; setTimeout(()=>copyFinalCodeBtn.innerText='Copy Code',1500); });
    // --- UPDATED EXPORT BUTTONS WITH PAYWALL ---

// 1. Export Code File Button
exportCodeBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Stop immediate action
    
    try {
        const response = await fetch('/check-auth');
        const data = await response.json();

        if (data.loggedIn && data.isPaid) {
            // PRO USER: Run your existing download logic
            const code = codeEditor.value;
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `codicts-form-${currentPlatform}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            updateSyncStatus('exported .txt');
        } else {
            // NOT PRO: Show paywall
            showStarterPaywall(data.loggedIn);
        }
    } catch (err) {
        console.error("Auth check failed", err);
    }
});

// 2. Export PNG Button
exportImageBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Stop immediate action

    try {
        const response = await fetch('/check-auth');
        const data = await response.json();

        if (data.loggedIn && data.isPaid) {
            // PRO USER: Run your existing PNG logic
            if (typeof html2canvas !== 'undefined') {
                html2canvas(document.getElementById('liveFormRoot')).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'codicts-design.png';
                    link.href = canvas.toDataURL();
                    link.click();
                });
            } else {
                alert("html2canvas library not loaded.");
            }
        } else {
            // NOT PRO: Show paywall
            showStarterPaywall(data.loggedIn);
        }
    } catch (err) {
        console.error("Auth check failed", err);
    }
});

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.getAttribute('data-platform');
            updateCodeForPlatform();
        });
    });
    applyFormDesign();
})();
