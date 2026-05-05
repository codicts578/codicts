(function() {
            const liveButton = document.getElementById('liveButton');
            const btnBgColor = document.getElementById('btnBgColor');
            const btnTextColor = document.getElementById('btnTextColor');
            const btnLabel = document.getElementById('btnLabel');
            const borderRadius = document.getElementById('borderRadius');
            const paddingX = document.getElementById('paddingX');
            const paddingY = document.getElementById('paddingY');
            const paddingXVal = document.getElementById('paddingXVal');
            const paddingYVal = document.getElementById('paddingYVal');
            const fontSize = document.getElementById('fontSize');
            const borderWidth = document.getElementById('borderWidth');
            const borderWidthVal = document.getElementById('borderWidthVal');
            
            const codeEditor = document.getElementById('codeEditor');
            const syncFromCodeBtn = document.getElementById('syncFromCodeBtn');
            const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
            const exportCodeBtn = document.getElementById('exportCodeBtn');
            const exportImageBtn = document.getElementById('exportImageBtn');
            const syncStatusSpan = document.getElementById('syncStatus');
            
            let currentPlatform = 'web';
            let isUpdatingFromCode = false;
            let isUpdatingFromDesign = false;
            
            paddingX.addEventListener('input', () => { paddingXVal.textContent = paddingX.value + 'px'; applyDesign(); });
            paddingY.addEventListener('input', () => { paddingYVal.textContent = paddingY.value + 'px'; applyDesign(); });
            borderWidth.addEventListener('input', () => { borderWidthVal.textContent = borderWidth.value + 'px'; applyDesign(); });
            
            function getDesign() {
                return {
                    bgColor: btnBgColor.value,
                    textColor: btnTextColor.value,
                    label: btnLabel.value,
                    radius: borderRadius.value,
                    padX: paddingX.value + 'px',
                    padY: paddingY.value + 'px',
                    fontSize: fontSize.value,
                    borderWidth: borderWidth.value + 'px'
                };
            }
            
            function escapeHtml(str) { return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }
            
            function generateWebCode() {
                const d = getDesign();
                return `<!-- Voltage Button with full effects -->
<div class="voltage-button">
    <button>${escapeHtml(d.label)}</button>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 234.6 61.3" preserveAspectRatio="none">
        <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"></feGaussianBlur>
            <feTurbulence type="fractalNoise" baseFrequency="0.075" numOctaves="0.3" result="turbulence"></feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="30" xChannelSelector="R" yChannelSelector="G" result="displace"></feDisplacementMap>
            <feMerge>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="displace"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
        </filter>
        <path class="voltage line-1" d="m216.3 51.2c-3.7 0-3.7-1.1-7.3-1.1-3.7 0-3.7 6.8-7.3 6.8-3.7 0-3.7-4.6-7.3-4.6-3.7 0-3.7 3.6-7.3 3.6-3.7 0-3.7-0.9-7.3-0.9-3.7 0-3.7-2.7-7.3-2.7-3.7 0-3.7 7.8-7.3 7.8-3.7 0-3.7-4.9-7.3-4.9-3.7 0-3.7-7.8-7.3-7.8-3.7 0-3.7-1.1-7.3-1.1-3.7 0-3.7 3.1-7.3 3.1-3.7 0-3.7 10.9-7.3 10.9-3.7 0-3.7-12.5-7.3-12.5-3.7 0-3.7 4.6-7.3 4.6-3.7 0-3.7 4.5-7.3 4.5-3.7 0-3.7 3.6-7.3 3.6-3.7 0-3.7-10-7.3-10-3.7 0-3.7-0.4-7.3-0.4-3.7 0-3.7 2.3-7.3 2.3-3.7 0-3.7 7.1-7.3 7.1-3.7 0-3.7-11.2-7.3-11.2-3.7 0-3.7 3.5-7.3 3.5-3.7 0-3.7 3.6-7.3 3.6-3.7 0-3.7-2.9-7.3-2.9-3.7 0-3.7 8.4-7.3 8.4-3.7 0-3.7-14.6-7.3-14.6-3.7 0-3.7 5.8-7.3 5.8-2.2 0-3.8-0.4-5.5-1.5-1.8-1.1-1.8-2.9-2.9-4.8-1-1.8 1.9-2.7 1.9-4.8 0-3.4-2.1-3.4-2.1-6.8s-9.9-3.4-9.9-6.8 8-3.4 8-6.8c0-2.2 2.1-2.4 3.1-4.2 1.1-1.8 0.2-3.9 2-5 1.8-1 3.1-7.9 5.3-7.9 3.7 0 3.7 0.9 7.3 0.9 3.7 0 3.7 6.7 7.3 6.7 3.7 0 3.7-1.8 7.3-1.8 3.7 0 3.7-0.6 7.3-0.6 3.7 0 3.7-7.8 7.3-7.8h7.3c3.7 0 3.7 4.7 7.3 4.7 3.7 0 3.7-1.1 7.3-1.1 3.7 0 3.7 11.6 7.3 11.6 3.7 0 3.7-2.6 7.3-2.6 3.7 0 3.7-12.9 7.3-12.9 3.7 0 3.7 10.9 7.3 10.9 3.7 0 3.7 1.3 7.3 1.3 3.7 0 3.7-8.7 7.3-8.7 3.7 0 3.7 11.5 7.3 11.5 3.7 0 3.7-1.4 7.3-1.4 3.7 0 3.7-2.6 7.3-2.6 3.7 0 3.7-5.8 7.3-5.8 3.7 0 3.7-1.3 7.3-1.3 3.7 0 3.7 6.6 7.3 6.6s3.7-9.3 7.3-9.3c3.7 0 3.7 0.2 7.3 0.2 3.7 0 3.7 8.5 7.3 8.5 3.7 0 3.7 0.2 7.3 0.2 3.7 0 3.7-1.5 7.3-1.5 3.7 0 3.7 1.6 7.3 1.6s3.7-5.1 7.3-5.1c2.2 0 0.6 9.6 2.4 10.7s4.1-2 5.1-0.1c1 1.8 10.3 2.2 10.3 4.3 0 3.4-10.7 3.4-10.7 6.8s1.2 3.4 1.2 6.8 1.9 3.4 1.9 6.8c0 2.2 7.2 7.7 6.2 9.5-1.1 1.8-12.3-6.5-14.1-5.5-1.7 0.9-0.1 6.2-2.2 6.2z" fill="transparent" stroke="#fff"></path>
        <path class="voltage line-2" d="m216.3 52.1c-3 0-3-0.5-6-0.5s-3 3-6 3-3-2-6-2-3 1.6-6 1.6-3-0.4-6-0.4-3-1.2-6-1.2-3 3.4-6 3.4-3-2.2-6-2.2-3-3.4-6-3.4-3-0.5-6-0.5-3 1.4-6 1.4-3 4.8-6 4.8-3-5.5-6-5.5-3 2-6 2-3 2-6 2-3 1.6-6 1.6-3-4.4-6-4.4-3-0.2-6-0.2-3 1-6 1-3 3.1-6 3.1-3-4.9-6-4.9-3 1.5-6 1.5-3 1.6-6 1.6-3-1.3-6-1.3-3 3.7-6 3.7-3-6.4-6-6.4-3 2.5-6 2.5h-6c-3 0-3-0.6-6-0.6s-3-1.4-6-1.4-3 0.9-6 0.9-3 4.3-6 4.3-3-3.5-6-3.5c-2.2 0-3.4-1.3-5.2-2.3-1.8-1.1-3.6-1.5-4.6-3.3s-4.4-3.5-4.4-5.7c0-3.4 0.4-3.4 0.4-6.8s2.9-3.4 2.9-6.8-0.8-3.4-0.8-6.8c0-2.2 0.3-4.2 1.3-5.9 1.1-1.8 0.8-6.2 2.6-7.3 1.8-1 5.5-2 7.7-2 3 0 3 2 6 2s3-0.5 6-0.5 3 5.1 6 5.1 3-1.1 6-1.1 3-5.6 6-5.6 3 4.8 6 4.8 3 0.6 6 0.6 3-3.8 6-3.8 3 5.1 6 5.1 3-0.6 6-0.6 3-1.2 6-1.2 3-2.6 6-2.6 3-0.6 6-0.6 3 2.9 6 2.9 3-4.1 6-4.1 3 0.1 6 0.1 3 3.7 6 3.7 3 0.1 6 0.1 3-0.6 6-0.6 3 0.7 6 0.7 3-2.2 6-2.2 3 4.4 6 4.4 3-1.7 6-1.7 3-4 6-4 3 4.7 6 4.7 3-0.5 6-0.5 3-0.8 6-0.8 3-3.8 6-3.8 3 6.3 6 6.3 3-4.8 6-4.8 3 1.9 6 1.9 3-1.9 6-1.9 3 1.3 6 1.3c2.2 0 5-0.5 6.7 0.5 1.8 1.1 2.4 4 3.5 5.8 1 1.8 0.3 3.7 0.3 5.9 0 3.4 3.4 3.4 3.4 6.8s-3.3 3.4-3.3 6.8 4 3.4 4 6.8c0 2.2-6 2.7-7 4.4-1.1 1.8 1.1 6.7-0.7 7.7-1.6 0.8-4.7-1.1-6.8-1.1z" fill="transparent" stroke="#fff"></path>
    </svg>
    <div class="dots"><div class="dot dot-1"></div><div class="dot dot-2"></div><div class="dot dot-3"></div><div class="dot dot-4"></div><div class="dot dot-5"></div></div>
</div>
<style>
.voltage-button{position:relative;display:inline-block;}
.voltage-button button{color:${d.textColor};background:${d.bgColor};padding:${d.padY} ${d.padX};border-radius:${d.radius};border:${d.borderWidth} solid #5978F3;font-size:${d.fontSize};line-height:1em;letter-spacing:0.075em;transition:background 0.3s;cursor:pointer;position:relative;z-index:2;}
.voltage-button button:hover{background:#0F1C53;}
.voltage-button button:hover + svg, .voltage-button button:hover + svg + .dots{opacity:1;}
.voltage-button svg{display:block;position:absolute;top:-0.75em;left:-0.25em;width:calc(100% + 0.5em);height:calc(100% + 1.5em);pointer-events:none;opacity:0;transition:opacity 0.4s;transition-delay:0.1s;z-index:5;}
.voltage-button svg path{stroke-dasharray:100;filter:url("#glow");}
.voltage-button svg path.line-1{stroke:#f6de8d;stroke-dashoffset:0;animation:spark-1 3s linear infinite;}
.voltage-button svg path.line-2{stroke:#6bfeff;stroke-dashoffset:500;animation:spark-2 3s linear infinite;}
.voltage-button .dots{opacity:0;transition:opacity 0.3s;transition-delay:0.4s;position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:6;}
.voltage-button .dots .dot{width:1rem;height:1rem;background:white;border-radius:100%;position:absolute;opacity:0;}
.voltage-button .dots .dot-1{top:0;left:20%;animation:fly-up 3s linear infinite;}
.voltage-button .dots .dot-2{top:0;left:55%;animation:fly-up 3s linear infinite;animation-delay:0.5s;}
.voltage-button .dots .dot-3{top:0;left:80%;animation:fly-up 3s linear infinite;animation-delay:1s;}
.voltage-button .dots .dot-4{bottom:0;left:30%;animation:fly-down 3s linear infinite;animation-delay:2.5s;}
.voltage-button .dots .dot-5{bottom:0;left:65%;animation:fly-down 3s linear infinite;animation-delay:1.5s;}
@keyframes spark-1{to{stroke-dashoffset:-1000;}}
@keyframes spark-2{to{stroke-dashoffset:-500;}}
@keyframes fly-up{0%{opacity:0;transform:translateY(0) scale(0.2);}5%{opacity:1;transform:translateY(-1.5rem) scale(0.4);}10%,100%{opacity:0;transform:translateY(-3rem) scale(0.2);}}
@keyframes fly-down{0%{opacity:0;transform:translateY(0) scale(0.2);}5%{opacity:1;transform:translateY(1.5rem) scale(0.4);}10%,100%{opacity:0;transform:translateY(3rem) scale(0.2);}}
</style>`;
            }
            
            function updateCodeForPlatform() {
                if (isUpdatingFromCode) return;
                if (currentPlatform === 'web') codeEditor.value = generateWebCode();
                else codeEditor.value = `// Code for ${currentPlatform} platform - full voltage effect available in Web version`;
            }
            
            function applyDesign() {
                if (isUpdatingFromCode) return;
                isUpdatingFromDesign = true;
                const d = getDesign();
                liveButton.style.backgroundColor = d.bgColor;
                liveButton.style.color = d.textColor;
                liveButton.style.borderRadius = d.radius;
                liveButton.style.padding = `${d.padY} ${d.padX}`;
                liveButton.style.fontSize = d.fontSize;
                liveButton.style.borderWidth = d.borderWidth;
                liveButton.innerText = d.label;
                isUpdatingFromDesign = false;
                updateCodeForPlatform();
                syncStatusSpan.textContent = '✓ design updated';
                setTimeout(() => { if(syncStatusSpan.textContent.includes('updated')) syncStatusSpan.textContent = '✓ live sync'; }, 1500);
            }
            
            function syncDesignFromCode() { alert("Edit the design controls to update code - or paste valid web code to sync back"); }
            
            async function exportImage() {
                const el = liveButton;
                const canvas = document.createElement('canvas');
                const rect = el.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
                const ctx = canvas.getContext('2d');
                const d = getDesign();
                ctx.fillStyle = d.bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = d.textColor;
                ctx.font = `bold ${parseInt(d.fontSize)}px Inter`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(d.label, canvas.width/2, canvas.height/2);
                canvas.toBlob(blob => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `voltage_button.png`;
                    a.click();
                    URL.revokeObjectURL(a.href);
                }, 'image/png');
            }
            
            btnBgColor.addEventListener('input', applyDesign);
            btnTextColor.addEventListener('input', applyDesign);
            btnLabel.addEventListener('input', applyDesign);
            borderRadius.addEventListener('change', applyDesign);
            fontSize.addEventListener('change', applyDesign);
            borderWidth.addEventListener('input', applyDesign);
            liveButton.addEventListener('click', () => alert('⚡ VOLTAGE SURGE! Hover to see glowing sparks!'));
            
            syncFromCodeBtn.addEventListener('click', syncDesignFromCode);
            copyFinalCodeBtn.addEventListener('click', async () => {
                await navigator.clipboard.writeText(codeEditor.value);
                copyFinalCodeBtn.innerText = '✅ Copied!';
                setTimeout(() => copyFinalCodeBtn.innerText = 'Copy Code', 1500);
            });
            exportCodeBtn.addEventListener('click', () => {
                const blob = new Blob([codeEditor.value], {type: 'text/html'});
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'voltage_button.html';
                a.click();
                URL.revokeObjectURL(a.href);
            });
            exportImageBtn.addEventListener('click', exportImage);
            
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