const UI_COMPONENTS = [
    { name: "Modern Navbar", category: "mystery", img: "images/components page/component1.png", tag: "Free" },
    { name: "Gradient Button", category: "buttons", img: "images/components page/component2.png", tag: "Free" },
    { name: "Glassmorphic Card", category: "cards", img: "images/components page/component3.png", tag: "Free" },
    // Add all your other components here...
];


    // This runs as soon as the page loads
    document.addEventListener('DOMContentLoaded', () => {
        
        // 1. Check if User is Logged In
        fetch('/check-auth')
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn) {
                    // Update Navbar to show Username and Logout button
                    const navButtons = document.querySelector('.navbar div');
                    if (navButtons) {
                        navButtons.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <span style="color: #333; font-weight: 600;">Hi, ${data.username}</span>
                                <button onclick="window.location.href='/logout'" style="padding: 5px 10px; cursor: pointer;">Logout</button>
                            </div>
                        `;
                    }

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



// This data object represents all your components
const allComponents = [
    { id: 1, name: "Modern Navbar", category: "mystery", img: "images/components page/component1.png", tag: "Free" },
    { id: 2, name: "Gradient Button", category: "buttons", img: "images/components page/component2.png", tag: "Free" },
    // ... add all your components here
];

///// SEE IF THE BELOW SPECIFIC BLOCK (ONLY CREATE CARD HTML) IS NEEDED OR NOT
// Function to generate the HTML for a card (Reusable)
function createCardHTML(item, isLiked) {
    return `
        <div class="itemCard" dataName="${item.category}">
            <div class="itemImg">
                <img src="${item.img}" alt="${item.name}">
                <div class="tag">${item.tag}</div>
            </div>
            <button>View Component</button>
            <i class="${isLiked ? 'fa-solid active' : 'fa-regular'} fa-heart like-icon" 
               data-name="${item.name}" 
               onclick="toggleLike(this, '${item.name}')"></i>
        </div>
    `;
}

function generateCardHTML(item, isLiked) {
    return `
        <div class="itemCard" dataName="${item.category}">
            <div class="itemImg">
                <img src="${item.img}" alt="${item.name}">
                <div class="tag">${item.tag}</div>
            </div>
            <button>View Component</button>
            <i class="${isLiked ? 'fa-solid active' : 'fa-regular'} fa-heart like-icon" 
               data-name="${item.name}" 
               onclick="toggleLike(this, '${item.name}')"></i>
        </div>
    `;
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
        
        // Update Navbar (Your existing code)
        document.querySelector('.navbar div').innerHTML = `<span>Hi, ${authData.username}</span>...`;
    }

    // 2. Render All Components
    collection.innerHTML = UI_COMPONENTS.map(item => {
        const isLiked = likedItems.includes(item.name);
        return generateCardHTML(item, isLiked);
    }).join('');
});