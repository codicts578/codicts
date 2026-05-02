document.addEventListener('click', async function (e) {
    // 1. Identify the target (handles clicking the icon inside the button too)
    const target = e.target.closest('.pro-link, #exportCodeBtn, #exportImageBtn');

    // 2. If it's not a protected element, let the click happen normally
    if (!target) return;

    // 3. STOP everything immediately (Prevents loginComponent.js from running)
    e.preventDefault();
    e.stopImmediatePropagation();
    
    console.log("Guard Intercepted click on:", target);

    try {
        // 4. Check Auth
        const response = await fetch('/check-auth?t=' + Date.now());
        const data = await response.json();

        if (data.loggedIn && data.isPaid) {
            console.log("User is PRO. Resuming action...");
            // User is Pro: Temporarily remove the pro-link class to prevent loop, then click
            const originalClass = target.className;
            const originalId = target.id;
            
            // We bypass the guard by manually triggering the logic 
            // since we've already stopped the original event.
            // Note: If loginComponent.js is also listening for clicks, 
            // you might need to trigger the logic manually here.
            
            // Re-trigger the click without the guard catching it
            target.classList.remove('pro-link');
            target.id = "temp_id_unlocked";
            target.click(); 
            
            // Put classes back for next time
            target.className = originalClass;
            target.id = originalId;
        } else {
            console.log("User is NOT PRO. Showing Popup.");
            showEditorPaywall(data.loggedIn);
        }
    } catch (err) {
        console.error("Auth check failed", err);
        showEditorPaywall(false);
    }
}, true); // The 'true' here is the most important part!

function showEditorPaywall(isLoggedIn) {
    if (document.querySelector('.starter-paywall-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'starter-paywall-overlay';
    
    const currentPath = window.location.pathname;
    const loginLink = `/frontend/Pages/Login and Signup Pages/login.html`;
    const pricingLink = `/frontend/Pages/Subscription Page/payment.html?redirect=${encodeURIComponent(currentPath)}`;

    overlay.innerHTML = `
        <div class="starter-paywall-modal">
            <i class="fa-solid fa-crown" style="color: #f59e0b; font-size: 3rem; margin-bottom: 15px;"></i>
            <h2>PRO Feature</h2>
            <p>${isLoggedIn ? 'This feature is exclusive to PRO members.' : 'Please log in and subscribe to unlock this feature.'}</p>
            <div class="modal-btns">
                <button onclick="this.closest('.starter-paywall-overlay').remove()" class="close-modal">Close</button>
                <a href="${isLoggedIn ? pricingLink : loginLink}" class="upgrade-modal-btn">
                    ${isLoggedIn ? 'Upgrade to PRO' : 'Log In'}
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}