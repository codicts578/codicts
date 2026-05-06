document.addEventListener('DOMContentLoaded', () => {
    const proLinks = document.querySelectorAll('.pro-link');

    proLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault(); // Stop the link from opening immediately
            const destination = link.href;

            try {
                const response = await fetch('/check-auth');
                const data = await response.json();

                if (data.loggedIn && data.isPaid) {
                    // User is logged in AND paid -> Let them through
                    window.open(destination, '_blank');
                } else {
                    // Not logged in or not paid -> Show message
                    showStarterPaywall(data.loggedIn);
                }
            } catch (err) {
                console.error("Auth check failed", err);
            }
        });
    });
});

function showStarterPaywall(isLoggedIn) {
    // Create the overlay
    const overlay = document.createElement('div');
    overlay.className = 'starter-paywall-overlay';
    
    const currentPath = window.location.pathname;
    const loginLink = `/frontend/Pages/Login-and-Signup-Pages/login.html`;
    const pricingLink = `/frontend/Pages/Subscription-Page/payment.html?redirect=${encodeURIComponent(currentPath)}`;

    overlay.innerHTML = `
        <div class="starter-paywall-modal">
            <i class="fa-solid fa-crown" style="color: #f59e0b; font-size: 3rem;"></i>
            <h2>Pro Template</h2>
            <p>${isLoggedIn ? 'This starter kit is exclusive to PRO members.' : 'Please log in and subscribe to access this template.'}</p>
            <div class="modal-btns">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-modal">Close</button>
                <a href="${isLoggedIn ? pricingLink : loginLink}" class="upgrade-modal-btn">
                    ${isLoggedIn ? 'Upgrade to PRO' : 'Log In'}
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}