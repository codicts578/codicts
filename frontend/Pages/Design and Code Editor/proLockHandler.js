(function() {
    // Cache the auth status to prevent 'await' delays during the click
    let isProUser = false;
    let authChecked = false;

    // Run this immediately to check status
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

    // THE BOUNCER: Standard click listener on Capture Phase
    window.addEventListener('click', function(e) {
        const target = e.target.closest('#exportCodeBtn, #exportImageBtn, .tab-btn.pro-link');
        
        if (!target) return;

        // If we haven't confirmed they are PRO, STOP everything instantly
        if (!isProUser) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // Kills your other script's listener

            // If it was an export button, show the popup
            if (target.id === 'exportCodeBtn' || target.id === 'exportImageBtn') {
                showExportPopup();
            } 
            // If it was a PRO tab, apply the blur to the editor ONLY
            else if (target.classList.contains('pro-link')) {
                applyTabBlur();
            }
        }
    }, true); // 'true' is critical to catch the event before your other script

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

    function showExportPopup() {
        if (document.querySelector('.paywall-full-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'paywall-full-overlay';

        // Note: backdrop-filter removed for no blur
        overlay.innerHTML = `
            <div class="paywall-lock" style="position: relative; width: 320px; height: auto; border-radius: 12px; top: 0; box-shadow: 0 0 50px rgba(0,0,0,0.5);">
                <i class="fa-solid fa-crown" style="font-size: 2.5rem; color: #f59e0b; margin-bottom: 15px;"></i>
                <h3 style="font-family: 'Archivo Black', sans-serif;">Export is PRO</h3>
                <p style="font-size: 0.9rem; margin-bottom: 20px;">Downloading source files is a PRO feature.</p>
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