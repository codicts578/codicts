   // This runs as soon as the page loads
    document.addEventListener('DOMContentLoaded', () => {
        
        // 1. Check if User is Logged In
        fetch('/check-auth')
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn) {
                    // 2. If logged in, fetch their likes to fill the hearts
                    return fetch('/my-likes');
                }
            })
            .then(res => (res ? res.json() : null))
            .then(data => {
                if (data && data.likes) {
                    // Look at every heart icon on the page
                    document.querySelectorAll('.like-icon').forEach(icon => {
                        const itemName = icon.getAttribute('data-name');
                        // If the item name exists in the user's 'likes' array from MongoDB
                        if (data.likes.includes(itemName)) {
                            icon.classList.remove('fa-regular'); // Remove empty heart
                            icon.classList.add('fa-solid', 'active'); // Add filled red heart
                        }
                    });
                }
            })
            .catch(err => console.error("Initialization error:", err));
    });

    // 3. The Toggle Function (Runs when you click a heart)
    async function toggleLike(element, itemName) {
    try {
        const res = await fetch('/like-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `itemName=${encodeURIComponent(itemName)}`
        });

        if (res.status === 401) {
            alert("Please log in!");
            return;
        }

        const data = await res.json();

        // 1. Check if we are on the Favourites page
        const isFavouritesPage = window.location.pathname.includes('favourite.html');

        if (data.status === "unliked") {
            if (isFavouritesPage) {
                // If on favourites page, remove the whole card from the UI
                const card = element.closest('.itemCard');
                card.style.opacity = '0'; // Optional: fade out effect
                setTimeout(() => card.remove(), 300);
            } else {
                // On main page, just toggle the heart look
                element.classList.replace('fa-solid', 'fa-regular');
                element.classList.remove('active');
            }
        } else {
            // Item Liked (Only happens on main page)
            element.classList.replace('fa-regular', 'fa-solid');
            element.classList.add('active');
        }

    } catch (err) {
        console.error("Error toggling like:", err);
    }

    if (document.querySelectorAll('.itemCard').length === 0) {
    document.querySelector('.UIcollection').innerHTML = "<h3>No saved components.</h3>";
}
}



document.addEventListener('DOMContentLoaded', async () => {
    const collection = document.querySelector('.UIcollection');
    
    // 1. Fetch Auth & Likes
    const authRes = await fetch('/check-auth');
    const authData = await authRes.json();
    
    let likedItems = [];
    if (authData.loggedIn) {
        const likesRes = await fetch('/my-likes');
        const likesData = await likesRes.json();
        likedItems = likesData.likes || [];
    }

    // 2. Render All Components
    collection.innerHTML = UI_COMPONENTS.map(item => {
        const isLiked = likedItems.includes(item.name);
        return generateCardHTML(item, isLiked);
    }).join('');
});




async function checkProAccess() {
    const codeArea = document.querySelector('.code-content');
    const codeWrapper = document.querySelector('.code-wrapper');

    if (!codeArea) return;

    try {
        const response = await fetch('/check-auth');
        const status = await response.json();

        if (status.loggedIn && status.isPaid) {
            // USER HAS PAID: Remove blur
            codeArea.classList.remove('blurred');
            const overlay = document.querySelector('.unlock-overlay');
            if (overlay) overlay.remove();
        } else {
            // USER HAS NOT PAID: Apply blur and show overlay
            codeArea.classList.add('blurred');
            
            // Add overlay if it doesn't exist
            if (!document.querySelector('.unlock-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'unlock-overlay';
                overlay.innerHTML = `
                    <i class="fa-solid fa-lock" style="font-size: 2rem;"></i>
                    <p>This is a PRO component</p>
                    <button class="unlock-btn" onclick="window.location.href='/frontend/Pages/Subscription Page/payment.html'">
                        Unlock with Pro
                    </button>
                `;
                codeWrapper.appendChild(overlay);
            }
        }
    } catch (err) {
        console.error("Auth check failed", err);
    }
}

// Call this function whenever a component is viewed
document.addEventListener('DOMContentLoaded', checkProAccess);