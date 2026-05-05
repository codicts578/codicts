(function() {
    // DOM Elements
    const gradientStart = document.getElementById('gradientStart');
    const gradientMid = document.getElementById('gradientMid');
    const gradientEnd = document.getElementById('gradientEnd');
    const cardRadius = document.getElementById('cardRadius');
    const logoText = document.getElementById('logoText');
    const hoverScale = document.getElementById('hoverScale');
    const animationSpeed = document.getElementById('animationSpeed');
    
    const liveCard = document.getElementById('liveCard');
    const cardBg = document.getElementById('cardBg');
    const logoTextEl = document.getElementById('logoTextEl');
    const codeEditor = document.getElementById('codeEditor');
    const copyFinalCodeBtn = document.getElementById('copyFinalCodeBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const syncStatusSpan = document.getElementById('syncStatus');
    
    let currentPlatform = 'web';
    
    function updateCardDesign() {
        // Update gradient
        const gradient = `linear-gradient(43deg, ${gradientStart.value} 0%, ${gradientMid.value} 46%, ${gradientEnd.value} 100%)`;
        cardBg.style.background = gradient;
        
        // Update border radius
        liveCard.style.borderRadius = cardRadius.value;
        
        // Update logo text
        logoTextEl.textContent = logoText.value;
        
        // Update hover scale
        const scale = hoverScale.value;
        const speed = animationSpeed.value;
        
        let styleTag = document.getElementById('card-hover-style');
        if(!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'card-hover-style';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = `
            .custom-card {
                transition: all ${speed}s ease-in-out !important;
            }
            .custom-card:hover {
                transform: scale(${scale}) !important;
            }
            .custom-card .box {
                transition: all ${speed}s ease-in-out !important;
            }
            .custom-card .logo {
                transition: all ${speed}s ease-in-out !important;
            }
        `;
        
        updateCode();
        updateSyncStatus('updated');
    }
    
    function updateSyncStatus(msg) {
        syncStatusSpan.textContent = `✓ ${msg}`;
        setTimeout(() => {
            if(syncStatusSpan.textContent.includes(msg)) 
                syncStatusSpan.textContent = '✓ ready';
        }, 1500);
    }
    
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
    }
    
    function generateWebCode() {
        const gradient = `linear-gradient(43deg, ${gradientStart.value} 0%, ${gradientMid.value} 46%, ${gradientEnd.value} 100%)`;
        const scale = hoverScale.value;
        const speed = animationSpeed.value;
        const radius = cardRadius.value;
        const logo = logoText.value || 'Socials';
        
        return `<!-- Social Media Card Component -->
<div class="social-card">
<div class="card-bg"></div>
<div class="card-logo">${escapeHtml(logo)}</div>
<a href="#"><div class="card-box box1"><svg viewBox="0 0 30 30" class="icon-svg"><path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"/></svg></div></a>
<a href="##"><div class="card-box box2"><svg viewBox="0 0 512 512" class="icon-svg"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg></div></a>
<a href="###"><div class="card-box box3"><svg viewBox="0 0 640 512" class="icon-svg"><path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/></svg></div></a>
<div class="card-box box4"></div>
</div>

<style>
.social-card {
position: relative;
width: 220px;
height: 220px;
background: lightgrey;
border-radius: ${radius};
overflow: hidden;
box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
transition: all ${speed}s ease-in-out;
border: 2px solid white;
cursor: pointer;
}
.social-card .card-bg {
position: absolute;
inset: 0;
background: ${gradient};
}
.social-card .card-logo {
position: absolute;
right: 50%;
bottom: 50%;
transform: translate(50%, 50%);
transition: all ${speed}s ease-in-out;
font-size: 1.3em;
font-weight: 600;
color: #ffffff;
letter-spacing: 3px;
z-index: 2;
}
.social-card .icon-svg {
fill: rgba(255, 255, 255, 0.797);
width: 20px;
transition: all 0.5s ease-in-out;
}
.social-card .card-box {
position: absolute;
padding: 10px;
text-align: right;
background: rgba(255, 255, 255, 0.389);
border-top: 2px solid white;
border-right: 1px solid white;
border-radius: 10% 13% 42% 0%/10% 12% 75% 0%;
box-shadow: rgba(100, 100, 111, 0.364) -7px 7px 29px 0px;
transform-origin: bottom left;
transition: all ${speed}s ease-in-out;
text-decoration: none;
display: flex;
align-items: center;
justify-content: flex-end;
z-index: 2;
}
.social-card .card-box::before {
content: "";
position: absolute;
inset: 0;
border-radius: inherit;
opacity: 0;
transition: all 0.5s ease-in-out;
z-index: -1;
}
.social-card .box1 { width: 70%; height: 70%; bottom: -70%; left: -70%; }
.social-card .box1::before { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #ff53d4 60%, #62c2fe 90%); }
.social-card .box2 { width: 50%; height: 50%; bottom: -50%; left: -50%; transition-delay: 0.2s; }
.social-card .box2::before { background: radial-gradient(circle at 30% 107%, #91e9ff 0%, #00ACEE 90%); }
.social-card .box3 { width: 30%; height: 30%; bottom: -30%; left: -30%; transition-delay: 0.4s; }
.social-card .box3::before { background: radial-gradient(circle at 30% 107%, #969fff 0%, #b349ff 90%); }
.social-card .box4 { width: 10%; height: 10%; bottom: -10%; left: -10%; transition-delay: 0.6s; }
.social-card:hover { transform: scale(${scale}); }
.social-card:hover .card-box { bottom: -1px; left: -1px; }
.social-card:hover .card-logo { transform: translate(70px, -52px); letter-spacing: 0px; }
.social-card .card-box:hover .icon-svg { fill: white; }
.social-card .card-box:hover::before { opacity: 1; }
</style>`;
    }
    
    function generateReactCode() {
        const gradient = `linear-gradient(43deg, ${gradientStart.value} 0%, ${gradientMid.value} 46%, ${gradientEnd.value} 100%)`;
        const scale = hoverScale.value;
        const speed = animationSpeed.value;
        const radius = cardRadius.value;
        const logo = logoText.value || 'Socials';
        
        return `// SocialCard.tsx
import React from 'react';
import './SocialCard.css';

const SocialCard: React.FC = () => {
return (
<div className="social-card">
<div className="card-bg"></div>
<div className="card-logo">${escapeHtml(logo)}</div>
<a href="#"><div className="card-box box1">
<svg viewBox="0 0 30 30" className="icon-svg">
    <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"/>
</svg>
</div></a>
{/* Add box2, box3, box4 similarly */}
</div>
);
};
export default SocialCard;

/* SocialCard.css */
.social-card {
position: relative;
width: 220px;
height: 220px;
border-radius: ${radius};
overflow: hidden;
transition: all ${speed}s ease-in-out;
cursor: pointer;
}
.social-card .card-bg {
position: absolute;
inset: 0;
background: ${gradient};
}
.social-card .card-logo {
position: absolute;
right: 50%;
bottom: 50%;
transform: translate(50%, 50%);
transition: all ${speed}s ease-in-out;
font-size: 1.3em;
font-weight: 600;
color: white;
z-index: 2;
}
.social-card:hover { transform: scale(${scale}); }
.social-card:hover .card-logo { transform: translate(70px, -52px); letter-spacing: 0px; }`;
    }
    
    function updateCode() {
        let code = '';
        if(currentPlatform === 'web') code = generateWebCode();
        else if(currentPlatform === 'react') code = generateReactCode();
        codeEditor.value = code;
    }
    
    function resetToDefault() {
        gradientStart.value = '#4158D0';
        gradientMid.value = '#C850C0';
        gradientEnd.value = '#FFCC70';
        cardRadius.value = '30px';
        logoText.value = 'Socials';
        hoverScale.value = '1.1';
        animationSpeed.value = '0.6';
        updateCardDesign();
        updateSyncStatus('reset to default');
    }
    
    async function copyCode() {
        await navigator.clipboard.writeText(codeEditor.value);
        copyFinalCodeBtn.textContent = '✅ Copied!';
        setTimeout(() => copyFinalCodeBtn.textContent = '📋 Copy Code', 1500);
        updateSyncStatus('copied to clipboard');
    }
    
    function exportCodeFile() {
        const code = codeEditor.value;
        const ext = currentPlatform === 'web' ? 'html' : 'tsx';
        const blob = new Blob([code], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `social-card.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        updateSyncStatus('exported');
    }
    
    // Event Listeners
    gradientStart.addEventListener('input', updateCardDesign);
    gradientMid.addEventListener('input', updateCardDesign);
    gradientEnd.addEventListener('input', updateCardDesign);
    cardRadius.addEventListener('change', updateCardDesign);
    logoText.addEventListener('input', updateCardDesign);
    hoverScale.addEventListener('change', updateCardDesign);
    animationSpeed.addEventListener('change', updateCardDesign);
    
    copyFinalCodeBtn.addEventListener('click', copyCode);
    exportCodeBtn.addEventListener('click', exportCodeFile);
    resetBtn.addEventListener('click', resetToDefault);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.getAttribute('data-platform');
            updateCode();
        });
    });
    
    // Initialize
    updateCardDesign();
})();