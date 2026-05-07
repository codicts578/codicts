(function() {
    // DOM elements
    const primaryColorPicker = document.getElementById('primaryColor');
    const secondaryColorPicker = document.getElementById('secondaryColor');
    const accentColorPicker = document.getElementById('accentColor');
    const formRadiusSelect = document.getElementById('formRadius');
    const animSpeedSelect = document.getElementById('animSpeed');
    const glowIntensitySelect = document.getElementById('glowIntensity');
    const liveFormContainer = document.getElementById('liveFormContainer');
    const codeEditor = document.getElementById('codeEditor');
    const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    
    // Animated Background Particles
    function initAnimatedBackground() {
        const bgContainer = document.getElementById('animatedBg');
        if (!bgContainer) return;
        bgContainer.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 8 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = Math.random() * 10 + 5 + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.background = `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 200 + 55}, ${Math.random() * 0.3 + 0.1})`;
            bgContainer.appendChild(particle);
        }
    }
    
    // Confetti Effect (only for form submission)
    function startConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 6 + 2,
                speedY: Math.random() * 5 + 3,
                speedX: (Math.random() - 0.5) * 3,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }
        
        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            
            particles.forEach(p => {
                if (p.y < canvas.height) {
                    active = true;
                    p.y += p.speedY;
                    p.x += p.speedX;
                    p.rotation += p.rotationSpeed;
                    
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                    ctx.restore();
                }
            });
            
            if (active) {
                requestAnimationFrame(animateConfetti);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        animateConfetti();
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 3000);
    }
    
    // Create Ripple
    function createRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const ripple = document.createElement('div');
        ripple.className = 'ripple-cosmic';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Get Live Form HTML with dynamic styles applied
    function getLiveFormHTML() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const accent = accentColorPicker.value;
        const formRadius = formRadiusSelect.value;
        const animSpeed = animSpeedSelect.value;
        const glowIntensity = glowIntensitySelect.value;
        
        return `
            <form class="cosmic-form" id="cosmicForm" style="border-radius: ${formRadius}; transition: all ${animSpeed} cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <h2 class="form-title-cosmic" style="transition: all ${animSpeed};">✦ Welcome Back ✦</h2>
                <p class="form-subtitle-cosmic">Enter the cosmic gateway</p>
                
                <div class="input-cosmic">
                    <input type="email" id="cosmicEmail" placeholder=" " required style="transition: all ${animSpeed}; border-radius: ${parseInt(formRadius) * 0.6}px;">
                    <i class="fas fa-user-astronaut"></i>
                    <label class="floating-label">Email Address</label>
                </div>
                
                <div class="input-cosmic">
                    <input type="password" id="cosmicPassword" placeholder=" " required style="transition: all ${animSpeed}; border-radius: ${parseInt(formRadius) * 0.6}px;">
                    <i class="fas fa-key"></i>
                    <label class="floating-label">Access Key</label>
                </div>
                
                <div class="form-options-cosmic">
                    <label class="checkbox-cosmic">
                        <input type="checkbox" id="cosmicRemember"> <span> Remember me</span>
                    </label>
                    <a href="#" class="forgot-cosmic" style="transition: all ${animSpeed};"> Forgot Password?</a>
                </div>
                
                <button type="submit" class="submit-cosmic" style="background: linear-gradient(135deg, ${primary}, ${secondary}); transition: all ${animSpeed}; border-radius: ${parseInt(formRadius) * 0.6}px; box-shadow: 0 0 ${glowIntensity} ${primary};">
                    Launch <i class="fas fa-rocket"></i>
                </button>
            </form>
        `;
    }
    
    function renderLiveForm() {
        liveFormContainer.innerHTML = getLiveFormHTML();
        
        // Add event listeners
        const form = document.getElementById('cosmicForm');
        const submitBtn = document.querySelector('.submit-cosmic');
        const inputs = document.querySelectorAll('.input-cosmic input');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                createRipple(e, submitBtn);
                startConfetti(); // Confetti only on form submission
                setTimeout(() => {
                    alert('✨✨ COSMIC ACCESS GRANTED! ✨✨\nWelcome to the universe!');
                }, 200);
            });
        }
        
        inputs.forEach(input => {
            input.addEventListener('mouseenter', (e) => {
                const wrapper = input.closest('.input-cosmic');
                createRipple(e, wrapper);
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
    
    // Generate Web Code (embedded full version)
    function generateWebCode() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        const accent = accentColorPicker.value;
        const formRadius = formRadiusSelect.value;
        const animSpeed = animSpeedSelect.value;
        const glowIntensity = glowIntensitySelect.value;
        
        return `<!-- COSMIC AURORA FORM - Complete Copy -->
<div class="cosmic-wrapper">
<form class="cosmic-form" id="cosmicLoginForm">
<h2 class="form-title-cosmic">✦ Welcome Back ✦</h2>
<p class="form-subtitle-cosmic">Enter the cosmic gateway</p>

<div class="input-cosmic">
    <input type="email" id="email" placeholder=" " required>
    <i class="fas fa-user-astronaut"></i>
    <label class="floating-label">Email Address</label>
</div>

<div class="input-cosmic">
    <input type="password" id="password" placeholder=" " required>
    <i class="fas fa-key"></i>
    <label class="floating-label">Access Key</label>
</div>

<div class="form-options-cosmic">
    <label class="checkbox-cosmic">
        <input type="checkbox">  Remember me
    </label>
    <a href="#" class="forgot-cosmic"> Forgot Password?</a>
</div>

<button type="submit" class="submit-cosmic">
    Launch  <i class="fas fa-rocket"></i>
</button>
</form>
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

.cosmic-wrapper {
display: flex;
justify-content: center;
align-items: center;
min-height: 100vh;
background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
font-family: 'Inter', sans-serif;
}

@keyframes gradientShift {
0% { background-position: 0% 50%; }
50% { background-position: 100% 50%; }
100% { background-position: 0% 50%; }
}

@keyframes titleGlow {
0%, 100% { text-shadow: 0 0 5px ${primary}; }
50% { text-shadow: 0 0 20px ${primary}, 0 0 30px ${secondary}; }
}

@keyframes rippleAnim {
0% { transform: scale(0); opacity: 0.6; }
100% { transform: scale(4); opacity: 0; }
}

.cosmic-form {
background: rgba(15, 25, 45, 0.75);
backdrop-filter: blur(12px);
border-radius: ${formRadius};
padding: 2rem;
width: 100%;
max-width: 440px;
box-shadow: 0 15px 35px rgba(0,0,0,0.3);
border: 1px solid rgba(255,255,255,0.15);
transition: all ${animSpeed} cubic-bezier(0.175, 0.885, 0.32, 1.275);
position: relative;
overflow: hidden;
}

.cosmic-form::before {
content: '';
position: absolute;
top: -2px;
left: -2px;
right: -2px;
bottom: -2px;
background: linear-gradient(45deg, ${primary}, ${secondary}, ${accent}, ${primary});
background-size: 300% 300%;
border-radius: calc(${formRadius} + 2px);
z-index: -1;
opacity: 0;
transition: opacity 0.5s;
animation: gradientShift 3s ease infinite;
}

.cosmic-form:hover::before {
opacity: 0.5;
}

.cosmic-form:hover {
transform: translateY(-10px) scale(1.02);
box-shadow: 0 25px 50px rgba(0,0,0,0.4);
}

.form-title-cosmic {
font-size: 2.2rem;
font-weight: 800;
margin-bottom: 0.5rem;
text-align: center;
background: linear-gradient(135deg, ${primary}, ${secondary}, ${accent});
background-size: 200% 200%;
-webkit-background-clip: text;
background-clip: text;
color: transparent;
animation: gradientShift 3s ease infinite, titleGlow 2s ease infinite;
}

.form-subtitle-cosmic {
text-align: center;
font-size: 0.85rem;
opacity: 0.8;
margin-bottom: 2rem;
color: #cbd5e6;
}

.input-cosmic {
position: relative;
margin-bottom: 1.8rem;
}

.input-cosmic input {
width: 100%;
padding: 1rem 1rem 1rem 2.8rem;
background: rgba(255, 255, 255, 0.08);
border: 2px solid rgba(255, 255, 255, 0.15);
border-radius: 16px;
font-size: 1rem;
color: white;
transition: all ${animSpeed} ease;
outline: none;
}

.input-cosmic input:focus {
border-color: ${primary};
background: rgba(255, 255, 255, 0.12);
transform: scale(1.02);
box-shadow: 0 0 ${glowIntensity} ${primary};
}

.input-cosmic input:hover {
transform: scale(1.01);
border-color: ${secondary};
}

.input-cosmic i {
position: absolute;
left: 1rem;
top: 50%;
transform: translateY(-50%);
color: rgba(255, 255, 255, 0.5);
transition: all ${animSpeed} ease;
}

.input-cosmic input:focus + i {
color: ${primary};
transform: translateY(-50%) scale(1.1);
}

.floating-label {
position: absolute;
left: 2.8rem;
top: 1rem;
font-size: 0.9rem;
color: rgba(255, 255, 255, 0.5);
pointer-events: none;
transition: all ${animSpeed} ease;
}

.input-cosmic input:focus ~ .floating-label,
.input-cosmic input:not(:placeholder-shown) ~ .floating-label {
top: -0.6rem;
left: 1rem;
font-size: 0.7rem;
background: rgba(0,0,0,0.6);
padding: 0 0.5rem;
border-radius: 20px;
color: ${primary};
}

.form-options-cosmic {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 1.8rem;
font-size: 0.85rem;
}

.checkbox-cosmic {
display: flex;
align-items: center;
gap: 0.5rem;
color: #cbd5e6;
cursor: pointer;
}

.checkbox-cosmic input {
accent-color: ${primary};
}

.forgot-cosmic {
color: ${secondary};
text-decoration: none;
transition: all ${animSpeed} ease;
}

.forgot-cosmic:hover {
color: ${accent};
transform: translateX(5px);
}

.submit-cosmic {
width: 100%;
padding: 1rem;
background: linear-gradient(135deg, ${primary}, ${secondary});
border: none;
border-radius: 16px;
font-size: 1rem;
font-weight: 700;
color: white;
cursor: pointer;
transition: all ${animSpeed} ease;
position: relative;
overflow: hidden;
box-shadow: 0 0 ${glowIntensity} ${primary};
}

.submit-cosmic:hover {
transform: translateY(-3px);
box-shadow: 0 10px 25px ${primary};
}

.submit-cosmic i {
margin-left: 8px;
transition: transform ${animSpeed};
}

.submit-cosmic:hover i {
transform: translateX(5px);
}

.ripple-cosmic {
position: absolute;
border-radius: 50%;
background: rgba(255,255,255,0.4);
pointer-events: none;
animation: rippleAnim 0.6s linear;
}
<\/style>

<script>
function createRipple(event, element) {
const rect = element.getBoundingClientRect();
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;
const ripple = document.createElement('div');
ripple.className = 'ripple-cosmic';
ripple.style.left = x + 'px';
ripple.style.top = y + 'px';
ripple.style.position = 'absolute';
element.style.position = 'relative';
element.style.overflow = 'hidden';
element.appendChild(ripple);
setTimeout(() => ripple.remove(), 600);
}

function startConfetti() {
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '9999';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 150; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 6 + 2,
        speedY: Math.random() * 5 + 3,
        speedX: (Math.random() - 0.5) * 3,
        color: \`hsl(\${Math.random() * 360}, 70%, 60%)\`,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    particles.forEach(p => {
        if (p.y < canvas.height) {
            active = true;
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            ctx.restore();
        }
    });
    if (active) requestAnimationFrame(animate);
    else canvas.remove();
}
animate();
setTimeout(() => canvas.remove(), 3000);
}

document.getElementById('cosmicLoginForm')?.addEventListener('submit', (e) => {
e.preventDefault();
const btn = e.target.querySelector('.submit-cosmic');
createRipple(e, btn);
startConfetti();
setTimeout(() => alert('✨ COSMIC ACCESS GRANTED! ✨'), 200);
});

document.querySelectorAll('.input-cosmic input').forEach(input => {
input.addEventListener('mouseenter', (e) => {
    const wrapper = input.closest('.input-cosmic');
    createRipple(e, wrapper);
});
});
<\/script>`;
    }
    
    function generateReactCode() {
        const primary = primaryColorPicker.value;
        const secondary = secondaryColorPicker.value;
        return `// CosmicForm.tsx
import React, { useState } from 'react';

const CosmicForm: React.FC = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
alert('✨ Cosmic Access Granted! ✨');
};

return (
<div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
<form onSubmit={handleSubmit} style={{ background: 'rgba(15,25,45,0.75)', backdropFilter: 'blur(12px)', borderRadius: '32px', padding: '2rem', width: '400px', boxShadow: '0 15px 35px rgba(0,0,0,0.3)' }}>
<h2 style={{ fontSize: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, ${primary}, ${secondary})', WebkitBackgroundClip: 'text', color: 'transparent' }}>✦ Welcome Back ✦</h2>
<input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '1rem', margin: '1rem 0', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '16px', color: 'white' }} />
<input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '1rem', margin: '1rem 0', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '16px', color: 'white' }} />
<button type="submit" style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, ${primary}, ${secondary})', border: 'none', borderRadius: '16px', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>Launch</button>
</form>
</div>
);
};

export default CosmicForm;`;
    }
    
    function generateAndroidCode() {
        const primary = primaryColorPicker.value;
        return `<!-- res/layout/activity_cosmic_login.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
android:layout_width="match_parent"
android:layout_height="match_parent"
android:orientation="vertical"
android:gravity="center"
android:background="@drawable/cosmic_gradient"
android:padding="24dp">

<TextView android:text="✦ Welcome Back ✦"
android:textSize="28sp"
android:textStyle="bold"
android:textColor="${primary}"
android:gravity="center"/>

<EditText android:id="@+id/email"
android:hint="Email Address"
android:inputType="textEmailAddress"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:padding="16dp"
android:backgroundTint="${primary}"/>

<EditText android:id="@+id/password"
android:hint="Access Key"
android:inputType="textPassword"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:padding="16dp"
android:backgroundTint="${primary}"/>

<Button android:id="@+id/loginBtn"
android:text="Launch"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:backgroundTint="${primary}"/>
</LinearLayout>`;
    }
    
    function generateTkinterCode() {
        const primary = primaryColorPicker.value;
        return `# Cosmic Login Form - Python Tkinter
import tkinter as tk
from tkinter import messagebox

def cosmic_login():
email = email_entry.get()
password = password_entry.get()
messagebox.showinfo("Access Granted", f"Welcome to the cosmos, {email}!")

root = tk.Tk()
root.title("Cosmic Login")
root.geometry("450x550")
root.configure(bg='#0f0c29')

# Form Frame
frame = tk.Frame(root, bg='rgba(15,25,45,0.75)', relief='flat')
frame.pack(pady=50, padx=30, fill='both', expand=True)

tk.Label(frame, text="✦ Welcome Back ✦", font=("Arial", 24, "bold"), bg='#0f192d', fg='${primary}').pack(pady=20)
tk.Label(frame, text="Enter the cosmic gateway", bg='#0f192d', fg='#cbd5e6').pack()

email_entry = tk.Entry(frame, font=("Arial", 12), bg='rgba(255,255,255,0.08)', fg='white', insertbackground='white')
email_entry.pack(fill='x', pady=10, padx=20)

password_entry = tk.Entry(frame, font=("Arial", 12), show="*", bg='rgba(255,255,255,0.08)', fg='white', insertbackground='white')
password_entry.pack(fill='x', pady=10, padx=20)

btn = tk.Button(frame, text="Launch", bg='${primary}', fg='white', font=("Arial", 12, "bold"), command=cosmic_login)
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
        a.download = `cosmic_form.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        updateSyncStatus('File exported!');
    }
    
    async function exportFormAsPNG() {
        const node = document.getElementById('liveFormContainer');
        if(!node) {
            updateSyncStatus('Form container not found', true);
            return;
        }
        try {
            updateSyncStatus('Capturing preview...');
            const canvas = await html2canvas(node, {
                scale: 2.5,
                backgroundColor: null,
                logging: false,
                useCORS: true,
                allowTaint: false
            });
            const link = document.createElement('a');
            const timestamp = Date.now();
            link.download = `cosmic_aurora_form_${timestamp}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            updateSyncStatus('PNG saved');
        } catch(e) {
            console.error(e);
            updateSyncStatus('Error capturing PNG. Try again.', true);
        }
    }
    
    // Event listeners
    primaryColorPicker.addEventListener('input', applyFormDesign);
    secondaryColorPicker.addEventListener('input', applyFormDesign);
    accentColorPicker.addEventListener('input', applyFormDesign);
    formRadiusSelect.addEventListener('change', applyFormDesign);
    animSpeedSelect.addEventListener('change', applyFormDesign);
    glowIntensitySelect.addEventListener('change', applyFormDesign);
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
    initAnimatedBackground();
    renderLiveForm();
    updateCodeForPlatform();
})();