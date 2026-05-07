(function() {
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
    
    function applyFormDesign() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const bgColor = bgColorPicker.value;
        const glitchDuration = glitchDurationSelect.value;
        
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
    
    // Web (HTML/CSS/JS) - identical to original full version
    function generateWebCode() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const bgColor = bgColorPicker.value;
        const glitchDuration = glitchDurationSelect.value;
        return `<!-- Cyberpunk Glitch Form (HTML/CSS/JS) -->\n<div class="glitch-form-wrapper">\n  <form class="glitch-card">\n    <div class="card-header">\n      <div class="card-title"><svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 3v4a1 1 0 0 0 1 1h4" stroke-width="1.5"/><path d="M17 21h-10a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/></svg><span>SECURE_DATA</span></div>\n    </div>\n    <div class="card-body">\n      <div class="form-group"><input type="text" placeholder=" "/><label class="form-label">USERNAME</label></div>\n      <div class="form-group"><input type="password" placeholder=" "/><label class="form-label">ACCESS_KEY</label></div>\n      <button class="submit-btn" data-text="INITIATE">INITIATE_CONNECTION</button>\n    </div>\n  </form>\n</div>\n<style>\n.glitch-form-wrapper{display:flex;justify-content:center;align-items:center;min-height:100vh;background:#050505;font-family:'Fira Code',monospace;}\n.glitch-card{background:${bgColor};max-width:380px;border:1px solid ${primary}33;box-shadow:0 0 20px ${primary}1a;}\n.card-title{color:${primary};display:flex;gap:0.5em;}\n.form-label{color:${primary};}\n.form-group input{border-bottom:2px solid ${primary}4d;background:transparent;color:#e5e5e5;}\n.submit-btn{border:2px solid ${primary};color:${primary};background:transparent;width:100%;padding:0.8em;cursor:pointer;transition:all 0.3s;}\n.submit-btn:hover{background:${primary};color:${bgColor};box-shadow:0 0 25px ${primary};}\n</style>\n<script>document.querySelector('.submit-btn')?.addEventListener('click',e=>{e.preventDefault();alert('SECURE CONNECTION');});<\/script>`;
    }
    
    // REACT (TSX) Editor
    function generateReactCode() {
        const primary = primaryColorPicker.value;
        const bgColor = bgColorPicker.value;
        return `// GlitchLoginForm.tsx (React + TypeScript)\nimport React, { useState } from 'react';\n\nconst GlitchLoginForm: React.FC = () => {\n  const [creds, setCreds] = useState({ username: '', password: '' });\n  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert('🔐 Glitch Access Granted'); };\n  \n  return (\n    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#050505', fontFamily: 'Fira Code' }}>\n      <form onSubmit={handleSubmit} style={{ background: '${bgColor}', maxWidth: 380, border: '1px solid ${primary}66', padding: '1.5rem' }}>\n        <h2 style={{ color: '${primary}', marginBottom: '1rem' }}>⚡ SECURE_DATA</h2>\n        <input type=\"text\" placeholder=\"USERNAME\" value={creds.username} onChange={e => setCreds({...creds, username: e.target.value})} style={{ width: '100%', marginBottom: '1rem', background: 'transparent', border: 'none', borderBottom: '2px solid ${primary}66', color: 'white', padding: '0.5rem 0' }} />\n        <input type=\"password\" placeholder=\"ACCESS_KEY\" value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})} style={{ width: '100%', marginBottom: '1.5rem', background: 'transparent', border: 'none', borderBottom: '2px solid ${primary}66', color: 'white', padding: '0.5rem 0' }} />\n        <button type=\"submit\" style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '2px solid ${primary}', color: '${primary}', fontWeight: 'bold', cursor: 'pointer' }}>INITIATE_CONNECTION</button>\n      </form>\n    </div>\n  );\n};\nexport default GlitchLoginForm;`;
    }
    
    // ANDROID STUDIO (Kotlin) - Material Design glitch style
    function generateAndroidCode() {
        const primary = primaryColorPicker.value;
        const bgColor = bgColorPicker.value;
        return `// MainActivity.kt (Android Studio - Glitch Theme)\npackage com.glitch.form\n\nimport android.os.Bundle\nimport android.widget.Button\nimport android.widget.EditText\nimport android.widget.Toast\nimport androidx.appcompat.app.AppCompatActivity\nimport androidx.core.content.ContextCompat\n\nclass MainActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n        \n        val usernameInput = findViewById<EditText>(R.id.etUsername)\n        val passwordInput = findViewById<EditText>(R.id.etPassword)\n        val loginBtn = findViewById<Button>(R.id.btnLogin)\n        \n        // Glitch colors - Primary: ${primary}, Background: ${bgColor}\n        loginBtn.setBackgroundColor(ContextCompat.getColor(this, android.R.color.transparent))\n        loginBtn.setTextColor(Color.parseColor("${primary}"))\n        \n        loginBtn.setOnClickListener {\n            Toast.makeText(this, \"🔐 INITIATING CONNECTION\", Toast.LENGTH_SHORT).show()\n        }\n    }\n}\n\n// activity_main.xml:\n<?xml version="1.0" encoding="utf-8"?>\n<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent" android:layout_height="match_parent"\n    android:gravity="center" android:background="#050505"\n    android:orientation="vertical" android:padding="32dp">\n    <TextView android:text="⚡ SECURE_DATA" android:textColor="${primary}"\n        android:textSize="24sp" android:layout_marginBottom="32dp"/>\n    <EditText android:id="@+id/etUsername" android:hint="USERNAME"\n        android:backgroundTint="${primary}" android:textColorHint="${primary}66"\n        android:layout_width="match_parent" android:layout_marginBottom="16dp"/>\n    <EditText android:id="@+id/etPassword" android:hint="ACCESS_KEY"\n        android:inputType="textPassword" android:backgroundTint="${primary}"\n        android:layout_width="match_parent" android:layout_marginBottom="24dp"/>\n    <Button android:id="@+id/btnLogin" android:text="INITIATE_CONNECTION"\n        android:background="@android:color/transparent" android:textColor="${primary}"\n        style="?android:attr/borderlessButtonStyle" android:layout_width="match_parent"/>\n</LinearLayout>`;
    }
    
    // TKINTER (Python) - Glitch-themed desktop app
    function generateTkinterCode() {
        const primary = primaryColorPicker.value;
        const bgColor = bgColorPicker.value;
        return `# glitch_login_app.py (Tkinter - Cyberpunk Glitch Form)\nimport tkinter as tk\nfrom tkinter import messagebox\n\nclass GlitchLoginApp:\n    def __init__(self, root):\n        self.root = root\n        root.title("⚡ GLITCH SECURE TERMINAL")\n        root.geometry("400x500")\n        root.configure(bg="${bgColor}")\n        \n        # Cyberpunk styling\n        self.primary = "${primary}"\n        \n        title = tk.Label(root, text="SECURE_DATA", fg=self.primary, bg="${bgColor}",\n                         font=("Fira Code", 18, "bold"))\n        title.pack(pady=40)\n        \n        # Username field\n        self.username_entry = tk.Entry(root, bg="${bgColor}", fg="#e5e5e5", insertbackground=self.primary,\n                                       font=("Fira Code", 12), relief="flat", highlightthickness=1,\n                                       highlightcolor=self.primary, highlightbackground=self.primary)\n        self.username_entry.pack(pady=10, padx=40, fill=\"x\")\n        username_label = tk.Label(root, text="USERNAME", fg=self.primary, bg="${bgColor}", font=("Fira Code", 9))\n        username_label.pack(anchor=\"w\", padx=40)\n        \n        # Password field\n        self.password_entry = tk.Entry(root, bg="${bgColor}", fg="#e5e5e5", show="*", insertbackground=self.primary,\n                                       font=("Fira Code", 12), relief="flat", highlightthickness=1,\n                                       highlightcolor=self.primary, highlightbackground=self.primary)\n        self.password_entry.pack(pady=10, padx=40, fill=\"x\")\n        password_label = tk.Label(root, text="ACCESS_KEY", fg=self.primary, bg="${bgColor}", font=("Fira Code", 9))\n        password_label.pack(anchor=\"w\", padx=40)\n        \n        # Glitch button with hover effect\n        self.btn = tk.Button(root, text="INITIATE_CONNECTION", bg="${bgColor}", fg=self.primary,\n                             font=(\"Fira Code\", 11, \"bold\"), relief=\"solid\", bd=2,\n                             activebackground=self.primary, activeforeground="${bgColor}\",\n                             command=self.on_login, cursor=\"hand2\")\n        self.btn.pack(pady=40, padx=40, fill=\"x\")\n        \n        # Glitch animation simulation on hover\n        self.btn.bind(\"<Enter>\", self.on_hover)\n        self.btn.bind(\"<Leave>\", self.on_leave)\n    \n    def on_hover(self, event):\n        self.btn.config(bg=self.primary, fg="${bgColor}\")\n    \n    def on_leave(self, event):\n        self.btn.config(bg="${bgColor}\", fg=self.primary)\n    \n    def on_login(self):\n        messagebox.showinfo(\"🔐 GLITCH ACCESS\", \"Connection Established. Welcome.\")\n\nif __name__ == \"__main__\":\n    root = tk.Tk()\n    app = GlitchLoginApp(root)\n    root.mainloop()`;
    }
    
    function updateCodeForPlatform() {
        let code = '';
        if(currentPlatform === 'web') code = generateWebCode();
        else if(currentPlatform === 'react') code = generateReactCode();
        else if(currentPlatform === 'android') code = generateAndroidCode();
        else if(currentPlatform === 'tkinter') code = generateTkinterCode();
        codeEditor.value = code;
    }
    
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
        let ext = 'txt';
        if(currentPlatform === 'web') ext = 'html';
        else if(currentPlatform === 'react') ext = 'tsx';
        else if(currentPlatform === 'android') ext = 'kt';
        else if(currentPlatform === 'tkinter') ext = 'py';
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
            alert('Please try again');
        }
    }
    
    function init() {
        formCanvas.innerHTML = getGlitchFormHTML();
        applyFormDesign();
        const form = document.getElementById('glitchForm');
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('🔐 INITIATING SECURE CONNECTION...\nWelcome to the system!');
            });
        }
    }
    
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