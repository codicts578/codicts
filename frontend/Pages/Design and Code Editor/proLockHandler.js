(function() {
    let isProUser = false;
    let authChecked = false;

    // Run auth check
    async function initAuth() {
        try {
            const response = await fetch('/check-auth?t=' + Date.now());
            const data = await response.json();
            isProUser = data.loggedIn && data.isPaid;
            authChecked = true;
        } catch (err) {
            isProUser = false;
        }
    }
    initAuth();

    // The logic to remove the lock/blur
    function removeTabBlur() {
        const codeArea = document.querySelector('.code-editor-area');
        const lockOverlay = document.querySelector('.paywall-lock');
        if (codeArea) codeArea.classList.remove('locked-blur');
        if (lockOverlay) lockOverlay.remove();
    }

    // The logic to apply the lock/blur
    function applyTabBlur() {
        const codeArea = document.querySelector('.code-editor-area');
        const container = document.querySelector('.code-editor-container');
        const tabContainer = document.querySelector('.editor-tabs');

        if (!codeArea || document.querySelector('.paywall-lock')) return;

        codeArea.classList.add('locked-blur');
        const lockOverlay = document.createElement('div');
        lockOverlay.className = 'paywall-lock';
        
        const offset = tabContainer.offsetHeight;
        lockOverlay.style.top = offset + "px";
        lockOverlay.style.height = `calc(100% - ${offset}px)`;

        lockOverlay.innerHTML = `
            <i class="fa-solid fa-lock" style="font-size: 2rem; margin-bottom: 10px; color: #3b82f6;"></i>
            <h3 style="font-family: 'Archivo Black', sans-serif;">PRO Content</h3>
            <p style="font-size: 0.8rem; opacity: 0.8;">Subscribe to unlock this platform's code</p>
            <a href="/frontend/Pages/Subscription Page/payment.html">
                <button class="paywall-btn">Upgrade Now</button>
            </a>
        `;
        container.appendChild(lockOverlay);
    }

    // Capture Phase Listener
    window.addEventListener('click', function(e) {
        const target = e.target.closest('.tab-btn, #exportCodeBtn, #exportImageBtn, #copyFinalCodeBtn');
        if (!target) return;

        const activeTab = document.querySelector('.tab-btn.active');
    const isProTabActive = activeTab && activeTab.classList.contains('pro-link');

        // 1. If it's an Export Button, we block it completely
        if (target.id === 'exportCodeBtn' || target.id === 'exportImageBtn' || target.id === 'copyFinalCodeBtn') {
            if (!isProUser && isProTabActive) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                if (target.id === 'copyFinalCodeBtn') {
                // Show a specific alert for copying
                alert("Please upgrade to PRO to copy this code.");
            } else {
                showExportPopup();
            }
            return;
            }
            return;
        }

        // 2. If it's a Tab Button
        if (target.classList.contains('tab-btn')) {
            // ALWAYS remove the blur first so the user can see the transition
            removeTabBlur();

            // If it's a PRO tab and they aren't pro, wait a tiny bit and apply blur
            // We DON'T stop propagation so the original script can highlight the tab
            if (target.classList.contains('pro-link') && !isProUser) {
                // setTimeout ensures the "active" class logic in logincomponent.js 
                // finishes before we overlay our lock
                setTimeout(applyTabBlur, 10);
            }
        }
    }, true); 

    function showExportPopup() {
        if (document.querySelector('.paywall-full-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'paywall-full-overlay';
        overlay.innerHTML = `
            <div class="paywall-lock" style="position: relative; width: 320px; height: auto; border-radius: 12px; top: 0; box-shadow: 0 0 50px rgba(0,0,0,0.5);">
                <i class="fa-solid fa-crown" style="font-size: 2.5rem; color: #f59e0b; margin-bottom: 15px;"></i>
                <h2 style="font-family: 'Archivo Black', sans-serif;">PRO Feature</h2>
                <p style="font-size: 0.9rem; margin-bottom: 20px;">Login and Upgrade to PRO to unlock this feature</p>
                <div style="display: flex; gap: 10px;">
                    <a href="/frontend/Pages/Subscription Page/payment.html"><button class="paywall-btn">Upgrade</button></a>
                    <button class="paywall-btn close-btn" style="background: #334155;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('.close-btn').onclick = () => overlay.remove();
    }
})();


window.addEventListener('keydown', function(e) {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.classList.contains('pro-link') && !isProUser) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            alert("Copying is disabled for PRO content.");
        }
    }
});