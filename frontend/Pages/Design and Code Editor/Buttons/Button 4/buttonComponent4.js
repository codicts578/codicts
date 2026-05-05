(function() {
        // DOM elements
        const liveButton = document.getElementById('liveButton');
        const textOverlay = document.getElementById('textOverlay');
        const btnWrapper = document.getElementById('gradientButtonWrapper');
        const btnBgColor = document.getElementById('btnBgColor');
        const btnTextColor = document.getElementById('btnTextColor');
        const btnLabel = document.getElementById('btnLabel');
        const borderRadius = document.getElementById('borderRadius');
        const paddingX = document.getElementById('paddingX');
        const paddingY = document.getElementById('paddingY');
        const paddingXVal = document.getElementById('paddingXVal');
        const paddingYVal = document.getElementById('paddingYVal');
        const fontSize = document.getElementById('fontSize');
        
        const codeEditor = document.getElementById('codeEditor');
        const syncFromCodeBtn = document.getElementById('syncFromCodeBtn');
        const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
        const exportCodeBtn = document.getElementById('exportCodeBtn');
        const exportImageBtn = document.getElementById('exportImageBtn');
        const syncStatusSpan = document.getElementById('syncStatus');
        
        let currentPlatform = 'web';
        let isUpdatingFromCode = false;
        let isUpdatingFromDesign = false;

        function showToastMessage(msg, isError = false) {
            const existingToast = document.querySelector('.toast-msg');
            if(existingToast) existingToast.remove();
            const toast = document.createElement('div');
            toast.className = 'toast-msg';
            toast.style.color = isError ? '#f87171' : '#e2e8f0';
            toast.innerHTML = msg;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2500);
        }

        function getDesign() {
            return {
                bgColor: btnBgColor.value,
                textColor: btnTextColor.value,
                label: btnLabel.value || "Button",
                radius: borderRadius.value,
                padX: paddingX.value + 'px',
                padY: paddingY.value + 'px',
                fontSize: fontSize.value,
            };
        }

        function escapeHtml(str) { return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }
        function escapeXml(str) { return str.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[m]); }

        // Apply design changes to preview with perfect fidelity
        function applyDesign() {
            if (isUpdatingFromCode) return;
            isUpdatingFromDesign = true;
            const d = getDesign();
            
            btnWrapper.style.setProperty('--rad', d.radius);
            btnWrapper.style.setProperty('--color-btn-bg', d.bgColor);
            btnWrapper.style.setProperty('--color-btn-text', d.textColor);
            btnWrapper.style.setProperty('--color-overlay-text', d.textColor);
            btnWrapper.style.fontSize = d.fontSize;
            
            liveButton.innerText = d.label;
            liveButton.style.padding = `${d.padY} ${d.padX}`;
            
            if (textOverlay) {
                textOverlay.innerText = d.label;
                textOverlay.style.padding = `${d.padY} ${d.padX}`;
                textOverlay.style.color = d.textColor;
                textOverlay.style.textShadow = `0 0 6px ${d.textColor === '#000000' ? '#ffffff' : '#ffffff'}`;
            }
            
            isUpdatingFromDesign = false;
            updateCodeForPlatform();
            updateSyncStatus('design → code');
        }
        
        // Web code generator (identical visual)
        function generateWebCode() {
            const d = getDesign();
            return `<!-- PixelPerfect Gradient Button - Export Ready -->
<div class="btn-wrapper" style="--rad:${d.radius}; --color-btn-bg:${d.bgColor}; --color-btn-text:${d.textColor}; --color-overlay-text:${d.textColor}; font-size:${d.fontSize};">
    <div class="light"></div>
    <div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div><div class="gradient-layer"></div>
    <button class="gradient-btn" style="padding:${d.padY} ${d.padX};">${escapeHtml(d.label)}</button>
    <div class="text-overlay" style="padding:${d.padY} ${d.padX};">${escapeHtml(d.label)}</div>
</div>
<style>
.btn-wrapper{position:relative;display:inline-flex;align-items:center;justify-content:center;overflow:clip;border:2px solid #fff;border-radius:var(--rad);font-family:'Inter',sans-serif;font-weight:600;filter:saturate(0.65) brightness(1.8);}
.gradient-btn{position:relative;z-index:-1;border:none;border-radius:var(--rad);font:inherit;letter-spacing:0.15rem;color:var(--color-btn-text);background-color:var(--color-btn-bg);box-shadow:inset 0 0 10px 9px #558;text-shadow:0 1px 3px #fff;mix-blend-mode:color-dodge;}
.text-overlay{position:absolute;pointer-events:none;z-index:2;border-radius:var(--rad);font:inherit;color:var(--color-overlay-text);text-shadow:0 0 4px #fff;box-shadow:inset 0 -4px 4px #0004, inset 0 4px 4px #fff5;mix-blend-mode:multiply;animation:opacityPulse 5s infinite;}
.gradient-layer{position:absolute;pointer-events:none;left:-160px;width:500%;aspect-ratio:1;background:radial-gradient(ellipse at 65% 180%,#fff,#00f,#fff,#00f,#fff,#00f,#fff,#00f,#fff,#00f,#fff);mix-blend-mode:difference;animation:rotate 8s linear infinite;}
.light{position:absolute;z-index:1;width:80%;height:1.9rem;background:#fff5;filter:blur(5px);animation:pulse 3s infinite;}
@keyframes rotate{100%{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.1;}}
@keyframes opacityPulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
.btn-wrapper:hover .text-overlay{transform:scale(1.05);}
.btn-wrapper:hover .gradient-btn{color:#0000;text-shadow:none;}
</style>`;
        }
        function generateReactCode() { const d=getDesign(); return `// React Component (Crisp Text)\nconst GradientBtn = () => (<div className="gb-wrap">...styles same as web</div>);`; }
        function generateAndroidCode() { const d=getDesign(); return `<!-- Android Studio -->\n<Button android:text="${escapeXml(d.label)}" android:textColor="${d.textColor}" android:background="${d.bgColor}" android:padding="${parseInt(d.padX)}dp" android:textSize="${parseInt(d.fontSize)}sp" />`; }
        function generateTkinterCode() { const d=getDesign(); return `# Python Tkinter\nbtn = tk.Button(text="${escapeXml(d.label)}", bg="${d.bgColor}", fg="${d.textColor}", font=("Inter", ${parseInt(d.fontSize)}))`; }
        
        function updateCodeForPlatform() {
            if (isUpdatingFromCode) return;
            let code = '';
            if (currentPlatform === 'web') code = generateWebCode();
            else if (currentPlatform === 'react') code = generateReactCode();
            else if (currentPlatform === 'android') code = generateAndroidCode();
            else if (currentPlatform === 'tkinter') code = generateTkinterCode();
            codeEditor.value = code;
        }
        
        function updateSyncStatus(msg) {
            syncStatusSpan.textContent = `✓ ${msg}`;
            setTimeout(() => { if(syncStatusSpan.textContent.includes(msg)) syncStatusSpan.textContent = '✓ live sync'; }, 1500);
        }
        
        // ========== HIGH-QUALITY, CRYSTAL CLEAR EXPORT ==========
        async function exportCrystalClearPNG() {
            const targetElement = document.getElementById('gradientButtonWrapper');
            if (!targetElement) return;
            
            // show loading indicator
            const originalBtnText = exportImageBtn.innerText;
            exportImageBtn.innerText = '✨ Capturing 4K...';
            exportImageBtn.disabled = true;
            
            try {
                // Temporarily freeze animations for perfect frame? optional but keep original design
                // but we keep animations active to match preview "exactly as is" (includes current animation frame)
                // Use html2canvas with extreme settings: scale, backgroundColor transparent, high quality
                const canvas = await html2canvas(targetElement, {
                    scale: 4,               // 4x super sampling → crisp retina / 4K export
                    backgroundColor: null,   // preserve gradient background
                    logging: false,
                    useCORS: false,
                    allowTaint: false,
                    windowWidth: targetElement.scrollWidth,
                    windowHeight: targetElement.scrollHeight,
                    onclone: (clonedDoc, element) => {
                        // ensure cloned element retains exact computed styles
                        const clonedWrapper = clonedDoc.getElementById('gradientButtonWrapper');
                        if(clonedWrapper) {
                            const origStyles = window.getComputedStyle(targetElement);
                            clonedWrapper.style.cssText = origStyles.cssText;
                        }
                    }
                });
                
                // Convert to high quality PNG blob
                canvas.toBlob((blob) => {
                    if (!blob) {
                        throw new Error("Canvas generation failed");
                    }
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `gradient_button_${Date.now()}.png`;
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                    showToastMessage('✅ PNG saved — crystal clear, matches preview exactly!', false);
                    updateSyncStatus('PNG exported (4K)');
                }, 'image/png', 1.0);
            } catch (error) {
                console.error(error);
                showToastMessage('⚠️ Export error, please try again', true);
                updateSyncStatus('export failed');
            } finally {
                exportImageBtn.innerText = originalBtnText;
                exportImageBtn.disabled = false;
            }
        }
        
        function syncDesignFromCode() {
            if (currentPlatform !== 'web') {
                showToastMessage('Switch to Web tab for sync', true);
                return;
            }
            if (isUpdatingFromDesign) return;
            isUpdatingFromCode = true;
            const txt = codeEditor.value;
            const bgMatch = txt.match(/--color-btn-bg:\s*([^;]+);/);
            const textMatch = txt.match(/--color-overlay-text:\s*([^;]+);/);
            const radiusMatch = txt.match(/--rad:\s*([^;]+);/);
            const labelMatch = txt.match(/<button[^>]*>([^<]+)<\/button>/);
            const fontSizeMatch = txt.match(/font-size:\s*([^;]+);/);
            if (bgMatch) btnBgColor.value = bgMatch[1].trim();
            if (textMatch) btnTextColor.value = textMatch[1].trim();
            if (radiusMatch) borderRadius.value = radiusMatch[1].trim();
            if (labelMatch && labelMatch[1]) btnLabel.value = labelMatch[1].trim();
            if (fontSizeMatch) fontSize.value = fontSizeMatch[1].trim();
            applyDesign();
            setTimeout(() => { isUpdatingFromCode = false; updateSyncStatus('code → design'); showToastMessage('Sync from code completed'); }, 50);
        }
        
        function exportCodeFile() {
            const code = codeEditor.value;
            let ext = currentPlatform === 'web' ? 'html' : (currentPlatform === 'react' ? 'tsx' : (currentPlatform === 'android' ? 'xml' : 'py'));
            const blob = new Blob([code], {type: 'text/plain'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `gradient_button.${ext}`;
            link.click();
            URL.revokeObjectURL(link.href);
            showToastMessage(`📁 ${ext.toUpperCase()} code exported`);
        }
        
        // Event listeners
        btnBgColor.addEventListener('input', applyDesign);
        btnTextColor.addEventListener('input', applyDesign);
        btnLabel.addEventListener('input', applyDesign);
        borderRadius.addEventListener('change', applyDesign);
        fontSize.addEventListener('change', applyDesign);
        paddingX.addEventListener('input', () => { paddingXVal.textContent = paddingX.value + 'px'; applyDesign(); });
        paddingY.addEventListener('input', () => { paddingYVal.textContent = paddingY.value + 'px'; applyDesign(); });
        
        liveButton.addEventListener('click', () => alert('✨ Interactive Preview — Text always crisp!'));
        syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
        copyFinalCodeBtn.addEventListener('click', async () => {
            await navigator.clipboard.writeText(codeEditor.value);
            copyFinalCodeBtn.innerText = '✅ Copied!';
            setTimeout(() => copyFinalCodeBtn.innerText = 'Copy Code', 1500);
        });
        exportCodeBtn.addEventListener('click', exportCodeFile);
        exportImageBtn.addEventListener('click', exportCrystalClearPNG);
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPlatform = btn.getAttribute('data-platform');
                updateCodeForPlatform();
            });
        });
        
        applyDesign();
    })();