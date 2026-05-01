async function applyProProtection() {
    const editorArea = document.querySelector('.code-editor-area');
    const container = document.querySelector('.code-editor-container');

    if (!editorArea || !container) return;

    try {
        const response = await fetch('/check-auth');
        const user = await response.json();

        // If user is NOT logged in OR hasn't paid
        if (!user.loggedIn || !user.isPaid) {
            
            // 1. Apply Blur
            editorArea.classList.add('locked-blur');

            // 2. Add Lock UI if it doesn't exist
            if (!document.querySelector('.paywall-lock')) {
                const lockDiv = document.createElement('div');
                lockDiv.className = 'paywall-lock';
                
                const message = !user.loggedIn 
                    ? "Log in to unlock this code" 
                    : "Upgrade to PRO to unlock this component";
                
                const link = !user.loggedIn 
                    ? "/frontend/Pages/Login and Signup Pages/login.html" 
                    : "/frontend/Pages/Subscription Page/payment.html";

                lockDiv.innerHTML = `
                    <i class="fa-solid fa-lock" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
                    <h3>PRO Feature</h3>
                    <p>${message}</p>
                    <button onclick="window.location.href='${link}'">
                        ${user.loggedIn ? 'Upgrade Now' : 'Log In'}
                    </button>
                `;
                container.appendChild(lockDiv);
            }
        } else {
            // USER HAS PAID: Ensure no blur exists
            editorArea.classList.remove('locked-blur');
            const lock = document.querySelector('.paywall-lock');
            if (lock) lock.remove();
        }
    } catch (err) {
        console.error("Protection check failed:", err);
    }
}

// Run protection check on load
document.addEventListener('DOMContentLoaded', applyProProtection);

async function applyProProtection() {
    const editorArea = document.querySelector('.code-editor-area');
    const container = document.querySelector('.code-editor-container');

    if (!editorArea || !container) return;

    try {
        // Adding cache-buster to ensure we get fresh data
        const response = await fetch('/check-auth?t=' + Date.now());
        
        if (!response.ok) throw new Error("Server response not ok");
        
        const user = await response.json();
        console.log("Auth Debug:", user);

        // LOGIC: If (Not Logged In) OR (Logged In but not Paid)
        if (!user.loggedIn || user.isPaid === false || user.isPaid === undefined) {
            showLock(user.loggedIn);
        } else {
            // USER IS LOGGED IN AND PAID
            unlockEditor();
        }
    } catch (err) {
        console.error("Protection check failed, defaulting to LOCKED:", err);
        showLock(false); // Default to locked if server fails
    }

    function showLock(isLoggedIn) {
    // 1. Apply blur to the editor specifically if not already there
    const editorArea = document.querySelector('.code-editor-area');
    if (editorArea) editorArea.classList.add('locked-blur');
    
    if (document.querySelector('.paywall-lock')) return;

    const container = document.querySelector('.code-editor-container');
    const lockDiv = document.createElement('div');
    lockDiv.className = 'paywall-lock';
    
    // CAPTURE CURRENT PATH: e.g., /frontend/Pages/.../buttonComponent.html
    const currentPath = window.location.pathname;
    
    const message = isLoggedIn 
        ? "Upgrade to PRO to unlock this component" 
        : "Log in to unlock this code";
    
    // ADD REDIRECT QUERY: Tells the payment page where to go back to
    const link = isLoggedIn 
        ? `/frontend/Pages/Subscription Page/payment.html?redirect=${encodeURIComponent(currentPath)}` 
        : "/frontend/Pages/Login and Signup Pages/login.html";

    lockDiv.innerHTML = `
        <i class="fa-solid fa-lock" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
        <h3>PRO Feature</h3>
        <p>${message}</p>
        <button onclick="window.location.href='${link}'">
            ${isLoggedIn ? 'Upgrade Now' : 'Log In'}
        </button>
    `;
    container.appendChild(lockDiv);
}

    function unlockEditor() {
    // 1. Find ALL elements that have the blur class and remove it
    const blurredElements = document.querySelectorAll('.locked-blur');
    blurredElements.forEach(el => {
        el.classList.remove('locked-blur');
    });

    // 2. Remove the lock overlay message
    const lock = document.querySelector('.paywall-lock');
    if (lock) lock.remove();

    console.log("All Pro features unlocked!");
}
}

document.addEventListener('DOMContentLoaded', applyProProtection);


const currentPath = window.location.pathname; // Gets the current page path
const link = isLoggedIn 
    ? `/frontend/Pages/Subscription Page/payment.html?redirect=${encodeURIComponent(currentPath)}` 
    : "/frontend/Pages/Login and Signup Pages/login.html";