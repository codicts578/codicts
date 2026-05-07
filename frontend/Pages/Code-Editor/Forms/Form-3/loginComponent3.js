(function() {
    // DOM elements
    const primaryColorPicker = document.getElementById('primaryColor');
    const secondaryColorPicker = document.getElementById('secondaryColor');
    const textColorPicker = document.getElementById('textColor');
    const formRadiusSelect = document.getElementById('formRadius');
    const animSpeedSelect = document.getElementById('animSpeed');
    const formCanvas = document.getElementById('formCanvas');
    const liveFormContainer = document.getElementById('liveFormContainer');
    const codeEditor = document.getElementById('codeEditor');
    const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    let particleInterval;
    
    // Particle System
    function initParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            const container = document.querySelector('.design-canvas');
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        
        function createParticle(x, y) {
            return {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2 - 1,
                life: 1,
                size: Math.random() * 4 + 2
            };
        }
        
        function animate() {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles = particles.filter(p => p.life > 0);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                p.vy += 0.05;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(102, 126, 234, ${p.life * 0.6})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }
        
        function addParticleExplosion(x, y) {
            for (let i = 0; i < 15; i++) {
                particles.push(createParticle(x, y));
            }
        }
        
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            addParticleExplosion(x, y);
        });
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
        
        return { addParticleExplosion };
    }
    
    // Ripple Effect Function
    function createRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Live Form HTML
    function getLiveFormHTML() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const textColor = textColorPicker.value;
        const formRadius = formRadiusSelect.value;
        const animSpeed = animSpeedSelect.value;
        
        return `
            <form class="ripple-form" id="liveRippleForm" style="border-radius: ${formRadius};">
                <h2 class="form-title" style="color: ${textColor}; background: linear-gradient(135deg, ${primary}, ${secondary}); -webkit-background-clip: text; background-clip: text; color: transparent;">Welcome Back</h2>
                <p class="form-subtitle" style="color: ${textColor};">Sign in to continue your journey</p>
                <div class="input-wrapper">
                    <input type="email" id="liveEmail" placeholder="Email address" required style="transition: all ${animSpeed} ease;">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="input-wrapper">
                    <input type="password" id="livePassword" placeholder="Password" required style="transition: all ${animSpeed} ease;">
                    <i class="fas fa-lock"></i>
                </div>
                <div class="form-options">
                    <label class="checkbox-label" style="color: ${textColor};">
                        <input type="checkbox" id="liveRemember"> Remember me
                    </label>
                    <a href="#" class="forgot-link" style="color: ${primary}; transition: all ${animSpeed} ease;">Forgot Password?</a>
                </div>
                <button type="submit" class="submit-btn" style="background: linear-gradient(135deg, ${primary}, ${secondary}); transition: all ${animSpeed} ease;">
                    Sign In <i class="fas fa-arrow-right"></i>
                </button>
            </form>
        `;
    }
    
    function renderLiveForm() {
        liveFormContainer.innerHTML = getLiveFormHTML();
        
        // Add ripple effect to button
        const btn = document.querySelector('#liveRippleForm .submit-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                createRipple(e, btn);
                setTimeout(() => {
                    alert('✨ Welcome! Login successful ✨');
                }, 200);
            });
        }
        
        // Add hover animation to inputs
        const inputs = document.querySelectorAll('#liveRippleForm input');
        inputs.forEach(input => {
            input.addEventListener('mouseenter', (e) => {
                const wrapper = input.closest('.input-wrapper');
                if (wrapper) createRipple(e, wrapper);
            });
        });
    }
    
    function applyFormDesign() {
        renderLiveForm();
        updateCodeForPlatform();
        updateSyncStatus('design updated');
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
        if (!str) return '';
        return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); 
    }
    
    // Generate Web Code (only the form)
    function generateWebCode() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const textColor = textColorPicker.value;
        const formRadius = formRadiusSelect.value;
        const animSpeed = animSpeedSelect.value;
        
        return `<!-- Ripple Effect Login Form - Web Version -->
<div class="form-wrapper">
<form class="ripple-form" id="rippleLoginForm">
<h2 class="form-title">Welcome Back</h2>
<p class="form-subtitle">Sign in to continue your journey</p>
<div class="input-wrapper">
    <input type="email" id="email" placeholder="Email address" required>
    <i class="fas fa-envelope"></i>
</div>
<div class="input-wrapper">
    <input type="password" id="password" placeholder="Password" required>
    <i class="fas fa-lock"></i>
</div>
<div class="form-options">
    <label class="checkbox-label">
        <input type="checkbox"> Remember me
    </label>
    <a href="#" class="forgot-link">Forgot Password?</a>
</div>
<button type="submit" class="submit-btn">
    Sign In <i class="fas fa-arrow-right"></i>
</button>
</form>
</div>

<style>
.form-wrapper {
display: flex;
justify-content: center;
align-items: center;
min-height: 100vh;
background: linear-gradient(135deg, ${primary}, ${secondary});
font-family: 'Inter', sans-serif;
}

.ripple-form {
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border-radius: ${formRadius};
padding: 2rem;
width: 100%;
max-width: 420px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ripple-form:hover {
transform: translateY(-5px);
box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.form-title {
font-size: 2rem;
font-weight: 700;
margin-bottom: 0.5rem;
text-align: center;
background: linear-gradient(135deg, ${primary}, ${secondary});
-webkit-background-clip: text;
background-clip: text;
color: transparent;
}

.form-subtitle {
text-align: center;
font-size: 0.85rem;
color: ${textColor};
opacity: 0.8;
margin-bottom: 2rem;
}

.input-wrapper {
position: relative;
margin-bottom: 1.5rem;
}

.input-wrapper input {
width: 100%;
padding: 1rem 1rem 1rem 2.5rem;
background: rgba(255, 255, 255, 0.15);
border: 2px solid rgba(255, 255, 255, 0.2);
border-radius: 12px;
font-size: 1rem;
color: ${textColor};
transition: all ${animSpeed} ease;
outline: none;
}

.input-wrapper input:focus {
border-color: ${primary};
background: rgba(255, 255, 255, 0.2);
transform: scale(1.02);
}

.input-wrapper input:hover {
transform: scale(1.02);
}

.input-wrapper i {
position: absolute;
left: 1rem;
top: 50%;
transform: translateY(-50%);
color: rgba(255, 255, 255, 0.6);
transition: all ${animSpeed} ease;
}

.input-wrapper input:focus + i {
color: ${primary};
}

.form-options {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 1.5rem;
font-size: 0.85rem;
}

.checkbox-label {
display: flex;
align-items: center;
gap: 0.5rem;
color: ${textColor};
cursor: pointer;
}

.forgot-link {
color: ${primary};
text-decoration: none;
transition: all ${animSpeed} ease;
}

.forgot-link:hover {
color: ${secondary};
transform: translateX(3px);
display: inline-block;
}

.submit-btn {
width: 100%;
padding: 1rem;
background: linear-gradient(135deg, ${primary}, ${secondary});
border: none;
border-radius: 12px;
font-size: 1rem;
font-weight: 600;
color: white;
cursor: pointer;
transition: all ${animSpeed} ease;
position: relative;
overflow: hidden;
}

.submit-btn:hover {
transform: translateY(-2px);
box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

@keyframes ripple {
0% { transform: scale(0); opacity: 0.6; }
100% { transform: scale(4); opacity: 0; }
}

.ripple-effect {
position: absolute;
border-radius: 50%;
background: rgba(255, 255, 255, 0.4);
pointer-events: none;
animation: ripple 0.6s linear;
}
</style>

<script>
function createRipple(event, element) {
const rect = element.getBoundingClientRect();
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;
const ripple = document.createElement('div');
ripple.className = 'ripple-effect';
ripple.style.left = x + 'px';
ripple.style.top = y + 'px';
ripple.style.position = 'absolute';
element.style.position = 'relative';
element.style.overflow = 'hidden';
element.appendChild(ripple);
setTimeout(() => ripple.remove(), 600);
}

document.getElementById('rippleLoginForm')?.addEventListener('submit', (e) => {
e.preventDefault();
const btn = e.target.querySelector('.submit-btn');
createRipple(e, btn);
setTimeout(() => alert('✨ Welcome! Login successful ✨'), 200);
});

document.querySelectorAll('.input-wrapper input').forEach(input => {
input.addEventListener('mouseenter', (e) => {
    const wrapper = input.closest('.input-wrapper');
    createRipple(e, wrapper);
});
});
<\/script>`;
    }
    
    function generateReactCode() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const formRadius = formRadiusSelect.value;
        
        return `// RippleForm.tsx
import React, { useState } from 'react';

const RippleForm: React.FC = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const createRipple = (event: React.MouseEvent, element: HTMLElement) => {
const rect = element.getBoundingClientRect();
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;
const ripple = document.createElement('div');
ripple.className = 'ripple-effect';
ripple.style.left = x + 'px';
ripple.style.top = y + 'px';
element.appendChild(ripple);
setTimeout(() => ripple.remove(), 600);
};

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
const btn = e.currentTarget.querySelector('.submit-btn') as HTMLElement;
createRipple(e as any, btn);
alert('✨ Welcome! Login successful ✨');
};

return (
<div className="form-wrapper">
<form className="ripple-form" onSubmit={handleSubmit}>
<h2 className="form-title">Welcome Back</h2>
<p className="form-subtitle">Sign in to continue your journey</p>
<div className="input-wrapper">
    <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
    <i className="fas fa-envelope"></i>
</div>
<div className="input-wrapper">
    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
    <i className="fas fa-lock"></i>
</div>
<button type="submit" className="submit-btn">Sign In <i className="fas fa-arrow-right"></i></button>
</form>
</div>
);
};

export default RippleForm;`;
    }
    
    function generateAndroidCode() {
        const primary = primaryColorPicker.value;
        return `<!-- res/layout/activity_login.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
android:layout_width="match_parent"
android:layout_height="match_parent"
android:orientation="vertical"
android:gravity="center"
android:background="@drawable/gradient_bg"
android:padding="24dp">

<EditText android:id="@+id/email"
android:hint="Email address"
android:inputType="textEmailAddress"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:padding="16dp"
android:backgroundTint="${primary}"/>

<EditText android:id="@+id/password"
android:hint="Password"
android:inputType="textPassword"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:padding="16dp"
android:backgroundTint="${primary}"/>

<Button android:id="@+id/loginBtn"
android:text="Sign In"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:backgroundTint="${primary}"/>
</LinearLayout>`;
    }
    
    function generateTkinterCode() {
        const primary = primaryColorPicker.value;
        return `# Python Tkinter Ripple Form
import tkinter as tk

def login():
username = username_entry.get()
password = password_entry.get()
messagebox.showinfo("Success", f"Welcome {username}!")

root = tk.Tk()
root.title("Ripple Login")
root.geometry("400x500")
root.configure(bg='#667eea')

# Form frame
frame = tk.Frame(root, bg='white', relief='flat')
frame.pack(pady=50, padx=30, fill='both', expand=True)

tk.Label(frame, text="Welcome Back", font=("Arial", 24, "bold"), bg='white', fg='#667eea').pack(pady=20)
tk.Label(frame, text="Sign in to continue", bg='white', fg='#666').pack()

username_entry = tk.Entry(frame, font=("Arial", 12), relief='flat')
username_entry.pack(fill='x', pady=10, padx=20)

password_entry = tk.Entry(frame, font=("Arial", 12), show="*", relief='flat')
password_entry.pack(fill='x', pady=10, padx=20)

btn = tk.Button(frame, text="Sign In", bg='#667eea', fg='white', font=("Arial", 12, "bold"), 
        relief='flat', command=login)
btn.pack(fill='x', pady=20, padx=20)

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
    
    async function copyCodeWithAnimation() {
        const code = codeEditor.value;
        await navigator.clipboard.writeText(code);
        copyFinalCodeBtn.classList.add('copy-animation');
        const originalText = copyFinalCodeBtn.innerHTML;
        copyFinalCodeBtn.innerHTML = '✓ Copied!';
        updateSyncStatus('Code copied to clipboard!');
        
        setTimeout(() => {
            copyFinalCodeBtn.innerHTML = originalText;
            copyFinalCodeBtn.classList.remove('copy-animation');
        }, 1500);
    }
    
    function exportCodeFile() {
        const code = codeEditor.value;
        const ext = currentPlatform === 'web' ? 'html' : (currentPlatform === 'react' ? 'tsx' : (currentPlatform === 'android' ? 'xml' : 'py'));
        const blob = new Blob([code], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `ripple_form.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        updateSyncStatus('File exported!');
    }
    
    async function exportFormAsPNG() {
        const node = document.querySelector('#liveFormContainer');
        if(!node) return;
        try {
            const canvas = await html2canvas(node, { scale: 2, backgroundColor: null });
            const link = document.createElement('a');
            link.download = `ripple_form_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            updateSyncStatus('PNG saved!');
        } catch(e) {
            updateSyncStatus('Error capturing PNG', true);
        }
    }
    
    // Event listeners
    primaryColorPicker.addEventListener('input', applyFormDesign);
    secondaryColorPicker.addEventListener('input', applyFormDesign);
    textColorPicker.addEventListener('input', applyFormDesign);
    formRadiusSelect.addEventListener('change', applyFormDesign);
    animSpeedSelect.addEventListener('change', applyFormDesign);
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
    
    // Initialize
    initParticles();
    renderLiveForm();
    updateCodeForPlatform();
})();