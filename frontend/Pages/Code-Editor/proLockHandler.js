(function() {
    // 1. Single State Management
    let userData = { loggedIn: false, isPaid: false };
    let isProUser = false;

    // 2. Auth Check
    async function initAuth() {
        try {
            const response = await fetch('/check-auth?t=' + Date.now());
            const data = await response.json();
            userData = data; 
            isProUser = (data.loggedIn && data.isPaid);
            updateLockUI(); 
        } catch (err) {
            console.error("Auth check failed", err);
        }
    }

    // 3. Popup Logic
    function showPaywallPopup() {
        if (document.querySelector('.paywall-popup-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'paywall-popup-overlay';
        
        let btnText = userData.loggedIn ? "Upgrade to Pro" : "Log In and Upgrade";
        let btnLink = userData.loggedIn ? "/frontend/Pages/Subscription-Page/payment.html" : "/frontend/Pages/Login-and-Signup-Pages/login.html";
        let message = userData.loggedIn 
            ? "You're logged in! Please upgrade to a Pro plan to export or copy premium source code." 
            : "Exporting and Copying are reserved for Pro members. Please log in and upgrade to unlock.";

        overlay.innerHTML = `
            <div class="paywall-popup-card">
                <button class="popup-close-btn">&times;</button>
                <div style="display: flex; justify-content: center; width: 100%;">
                    <i class="fa-solid fa-crown" style="color:#3b82f6; font-size:2.5rem; margin-bottom:15px;"></i>
                </div>
                <h2>Premium Feature</h2>
                <p>${message}</p>
                <a href="${btnLink}" class="pw-primary-btn" style="width:100%; text-align:center; display: block; background: linear-gradient(135deg, #328EB8, #793CE3); color: white; text-decoration: none; padding: 12px; border-radius: 8px; font-weight: bold;">
                    ${btnText}
                </a>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.querySelector('.popup-close-btn').onclick = () => overlay.remove();
        overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };
    }

    // 4. UI Logic
    function updateLockUI() {
        const codeArea = document.querySelector('.code-editor-area');
        const activeTab = document.querySelector('.tab-btn.active');

        const existingLock = codeArea ? codeArea.querySelector('.paywall-lock') : null;
        if (existingLock) existingLock.remove();
        if (codeArea) codeArea.classList.remove('locked-blur');

        const isProTab = activeTab && activeTab.classList.contains('pro-link');

        if (isProTab && !isProUser) {
            if (codeArea) {
                codeArea.classList.add('locked-blur');
                const lock = document.createElement('div');
                lock.className = 'paywall-lock';
                
                let btnText = userData.loggedIn ? "Upgrade to Pro" : "Log In and Upgrade";
                let btnLink = userData.loggedIn ? "/frontend/Pages/Subscription-Page/payment.html" : "/frontend/Pages/Login-and-Signup Pages/login.html";

                lock.innerHTML = `
                    <div class="access-card" style="display: flex; flex-direction: column; align-items: center;">
                        <i class="fa-solid fa-crown" style="color:#f59e0b; font-size:2.5rem; margin-bottom:15px;"></i>
                        <h2 style="color:white; margin:0 0 10px 0; font-family:sans-serif; font-size: 1.3rem;">Pro Feature</h2>
                        <p style="color:#94a3b8; font-size:0.85rem; margin-bottom:25px; text-align: center;">
                            ${userData.loggedIn ? 'Upgrade to a Pro plan to access this source code.' : 'Log in and upgrade to Pro to access this code.'}
                        </p>
                        <a href="${btnLink}" class="pw-primary-btn" style="width: 100%; text-align: center; background: linear-gradient(135deg, #328EB8, #793CE3); color: white; text-decoration: none; padding: 12px; border-radius: 8px; font-weight: bold;">
                            ${btnText}
                        </a>
                    </div>
                `;
                codeArea.appendChild(lock);
            }
        }
    }

    // 5. High-Priority Click Interceptor
    // Using { capture: true } to stop events before they reach other scripts
    document.addEventListener('click', (e) => {
        const activeTab = document.querySelector('.tab-btn.active');
        const isProTab = activeTab && activeTab.classList.contains('pro-link');

        // Handle Tab Switching
        if (e.target.closest('.tab-btn')) {
            setTimeout(updateLockUI, 50);
            return; // Don't preventDefault on tabs
        }

        // Handle Copy/Export Interception
        if (isProTab && !isProUser) {
            const target = e.target.closest('#exportCodeBtn, #copyFinalCodeBtn, .export-btn, .copy-btn');
            if (target) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Kills the event for all other listeners
                showPaywallPopup();
            }
        }
    }, { capture: true });

    initAuth();
})();